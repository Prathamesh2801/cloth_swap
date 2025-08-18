// src/api/finalClothSwap.js
import { BASE_URL } from "../../config";
import base64ToFile from "../helper/base64ToFile";

/** parse a single SSE block text to {event, dataStr} */
function parseSSEBlock(block) {
  const lines = block.split(/\r?\n/).filter(Boolean);
  let event = "message";
  const dataLines = [];
  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.replace(/^event:\s*/, "").trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.replace(/^data:\s*/, ""));
    }
  }
  const dataStr = dataLines.join("\n");
  return { event, dataStr };
}

export async function startSSEProcess(
  person,
  gender,
  type,
  clothId,
  onMessage,
  onError,
  onComplete
) {
  try {
    const formData = new FormData();
    formData.append("person", person);
    formData.append("gender", gender);
    formData.append("type", type);
    formData.append("clothId", clothId);

    const resp = await fetch(`${BASE_URL}/sse_process.php`, {
      method: "POST",
      body: formData,
      // credentials: 'include' // uncomment if needed
    });

    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`Server returned ${resp.status}: ${t}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let closed = false;

    while (!closed) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // find the earliest separator (\r\n\r\n or \n\n)
      let sepIndex = -1;
      let sepLen = 0;
      const rnIndex = buffer.indexOf("\r\n\r\n");
      const nIndex = buffer.indexOf("\n\n");
      if (rnIndex !== -1 && (nIndex === -1 || rnIndex < nIndex)) {
        sepIndex = rnIndex;
        sepLen = 4;
      } else if (nIndex !== -1) {
        sepIndex = nIndex;
        sepLen = 2;
      }

      while (sepIndex !== -1) {
        const rawBlock = buffer.slice(0, sepIndex).trim();
        buffer = buffer.slice(sepIndex + sepLen);

        if (rawBlock) {
          const { event, dataStr } = parseSSEBlock(rawBlock);
          let parsed = null;
          try {
            parsed = dataStr ? JSON.parse(dataStr) : null;
          } catch (err) {
            parsed = { data: dataStr }; // fallback to raw string
          }

          // Determine effective event: either the explicit 'event' header or parsed.status
          const effectiveEvent =
            event === "message" && parsed && parsed.status
              ? parsed.status
              : event;

          // Notify caller
          try {
            onMessage?.(effectiveEvent, parsed);
          } catch (cbErr) {
            console.error("onMessage callback threw:", cbErr);
          }

          // If server signalled done, call onComplete and stop reading
          if (effectiveEvent === "done") {
            try {
              onComplete?.(parsed);
            } catch (cbErr) {
              console.error("onComplete callback threw:", cbErr);
            }
            closed = true;
            break;
          }
        }

        // update separator search for next block
        const rn = buffer.indexOf("\r\n\r\n");
        const nn = buffer.indexOf("\n\n");
        if (rn !== -1 && (nn === -1 || rn < nn)) {
          sepIndex = rn;
          sepLen = 4;
        } else if (nn !== -1) {
          sepIndex = nn;
          sepLen = 2;
        } else {
          sepIndex = -1;
        }
      }
    }

    // cleanup
    try {
      await reader.cancel();
    } catch (e) {}
  } catch (err) {
    console.error("Error in startSSEProcess:", err);
    onError?.(err);
  }
}
