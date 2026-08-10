import { collectionCards, setCollections } from "../data/collection.js";
import { artworkFor } from "../data/artwork.js";
import { cardArtOverrides, superstarArtOverrides } from "../data/card-art-overrides.js";

const $ = (selector) => document.querySelector(selector);
const canvas = $("#crop-canvas");
const ctx = canvas.getContext("2d", { alpha: false });
const frame = $("#card-frame-preview");

const state = {
  card: null,
  image: null,
  imageObjectUrl: null,
  sourceLabel: "No image loaded",
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  projectRoot: null,
  cardOverrides: { ...cardArtOverrides },
  superstarOverrides: { ...superstarArtOverrides },
  pointerMap: new Map(),
  lastPinchDistance: null,
  sessionExportedCount: 0,
  dragPointerId: null,
  dragLast: null,
};

const kinds = ["all", ...new Set(collectionCards.map(card => card.kind))];
const setIds = Object.keys(setCollections);

function assetUrl(path) {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  return new URL(`../../${path.replace(/^\.\//, "")}`, import.meta.url).href;
}

function esc(text) {
  return String(text ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function typeLabel(card) {
  if (!card) return "CARD";
  return card.finisher ? "FINISHER" : card.kind.toUpperCase();
}

function statMarkup(card) {
  if (!card) return `<span><small>COST</small><b>—</b></span><span><small>DAMAGE</small><b>—</b></span>`;
  if (card.kind === "move") return `<span><small>COST</small><b>${card.cost ?? 0}</b></span><span><small>DAMAGE</small><b>${card.damage ?? 0}</b></span>`;
  if (card.kind === "superstar") return `<span><small>HP</small><b>${card.hp ?? "—"}</b></span><span><small>SET</small><b>${esc(card.cardCode ?? "—")}</b></span>`;
  if (card.kind === "momentum") return `<span><small>METHOD</small><b>${esc((card.method ?? "MO").slice(0, 2).toUpperCase())}</b></span><span><small>GAIN</small><b>+${card.amount ?? 1}</b></span>`;
  return `<span><small>TYPE</small><b>${esc(card.kind.toUpperCase())}</b></span><span><small>SET</small><b>${esc(card.cardCode ?? "—")}</b></span>`;
}

function outputDimensions() {
  const [width, height] = $("#output-size").value.split("x").map(Number);
  return { width, height };
}

function currentDestination() {
  if (!state.card) return "assets/cards/art/custom/…";
  if ($("#wrestler-default").checked && state.card.superstarId) {
    return `assets/cards/art/custom/superstars/${state.card.superstarId}.webp`;
  }
  return `assets/cards/art/custom/${state.card.id}.webp`;
}

function manifestEntryText() {
  if (!state.card) return "Select a card first.";
  const path = currentDestination();
  if ($("#wrestler-default").checked && state.card.superstarId) {
    return `"${state.card.superstarId}": "${path}",`;
  }
  return `"${state.card.id}": "${path}",`;
}

function updateDestinationUi() {
  $("#export-path").textContent = currentDestination();
  $("#manifest-entry").textContent = manifestEntryText();
}

function populateFilters() {
  $("#set-filter").innerHTML = setIds.map(id => `<option value="${id}">${esc(setCollections[id].displayName)}</option>`).join("");
  $("#kind-filter").innerHTML = kinds.map(kind => `<option value="${kind}">${kind === "all" ? "All card types" : esc(kind[0].toUpperCase() + kind.slice(1))}</option>`).join("");
  refreshCardList();
}

function refreshCardList() {
  const setId = $("#set-filter").value || setIds[0];
  const kind = $("#kind-filter").value || "all";
  const query = $("#card-search").value.trim().toLowerCase();
  const previous = state.card?.id;
  const visible = collectionCards.filter(card => {
    if (card.setId !== setId) return false;
    if (kind !== "all" && card.kind !== kind) return false;
    if (query && !`${card.name} ${card.id} ${card.superstarId ?? ""} ${card.cardCode ?? ""}`.toLowerCase().includes(query)) return false;
    return true;
  });
  $("#card-select").innerHTML = visible.map(card => `<option value="${esc(card.id)}">${esc(card.cardCode)} · ${esc(card.name)} · ${esc(card.kind)}</option>`).join("");
  const nextId = visible.some(card => card.id === previous) ? previous : visible[0]?.id;
  if (nextId) {
    $("#card-select").value = nextId;
    selectCard(nextId, { loadCurrent: !state.card || state.card.id !== nextId });
  } else {
    state.card = null;
    updateSelectedCardUi();
  }
}

function updateSelectedCardUi() {
  const card = state.card;
  if (!card) {
    $("#selected-card-summary").innerHTML = `<small>No matching cards.</small>`;
    $("#preview-card-name").textContent = "Choose a card";
    $("#preview-title").textContent = "WWE Legacy";
    $("#preview-type").textContent = "CARD";
    $("#preview-stats").innerHTML = statMarkup(null);
    $("#wrestler-default-row").hidden = true;
    updateDestinationUi();
    return;
  }
  const setName = setCollections[card.setId]?.displayName ?? card.setId;
  $("#selected-card-summary").innerHTML = `<span>${esc(card.cardCode)} · ${esc(setName)}</span><b>${esc(card.name)}</b><small>${esc(typeLabel(card))}${card.superstarId ? ` · ${esc(card.superstarId)}` : ""}</small>`;
  $("#preview-card-name").textContent = card.name;
  $("#preview-title").textContent = card.name;
  $("#preview-type").textContent = typeLabel(card);
  $("#preview-stats").innerHTML = statMarkup(card);
  frame.className = `card-frame-preview set-${card.setId} type-${card.kind}${card.finisher ? " is-finisher" : ""}`;
  $("#wrestler-default-row").hidden = !card.superstarId;
  if (!card.superstarId) $("#wrestler-default").checked = false;
  const current = artworkFor(card);
  $("#current-art-image").src = assetUrl(current);
  $("#current-art-label").textContent = current || "No artwork path";
  updateDestinationUi();
}

async function selectCard(id, { loadCurrent = false } = {}) {
  const changed = state.card?.id !== id;
  state.card = collectionCards.find(card => card.id === id) ?? null;
  if (changed) $("#wrestler-default").checked = false;
  updateSelectedCardUi();
  if (loadCurrent && state.card) await loadCurrentArtwork();
}

function revokeObjectUrl() {
  if (state.imageObjectUrl) URL.revokeObjectURL(state.imageObjectUrl);
  state.imageObjectUrl = null;
}

function setStatus(message, type = "") {
  const el = $("#source-status");
  el.textContent = message;
  el.className = `source-status${type ? ` ${type}` : ""}`;
}

function setExportStatus(message, type = "") {
  const el = $("#export-status");
  el.textContent = message;
  el.className = `export-status${type ? ` ${type}` : ""}`;
}

function resetTransform() {
  state.zoom = 1;
  state.offsetX = 0;
  state.offsetY = 0;
  syncTransformControls();
  renderCrop();
}

function syncTransformControls() {
  $("#zoom").value = String(Math.round(state.zoom * 100));
  $("#zoom-value").textContent = `${Math.round(state.zoom * 100)}%`;
  $("#offset-x").value = String(Math.round(state.offsetX));
  $("#offset-y").value = String(Math.round(state.offsetY));
  $("#x-value").textContent = String(Math.round(state.offsetX));
  $("#y-value").textContent = String(Math.round(state.offsetY));
}

function clampOffsets() {
  if (!state.image) return;
  const base = Math.max(canvas.width / state.image.naturalWidth, canvas.height / state.image.naturalHeight);
  const scale = base * state.zoom;
  const drawW = state.image.naturalWidth * scale;
  const drawH = state.image.naturalHeight * scale;
  const maxX = Math.max(0, (drawW - canvas.width) / 2);
  const maxY = Math.max(0, (drawH - canvas.height) / 2);
  state.offsetX = Math.max(-maxX, Math.min(maxX, state.offsetX));
  state.offsetY = Math.max(-maxY, Math.min(maxY, state.offsetY));
  const sliderX = Math.max(100, Math.ceil(maxX));
  const sliderY = Math.max(100, Math.ceil(maxY));
  $("#offset-x").min = String(-sliderX); $("#offset-x").max = String(sliderX);
  $("#offset-y").min = String(-sliderY); $("#offset-y").max = String(sliderY);
}

function renderCrop() {
  ctx.fillStyle = "#17171c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!state.image) return;
  clampOffsets();
  const base = Math.max(canvas.width / state.image.naturalWidth, canvas.height / state.image.naturalHeight);
  const scale = base * state.zoom;
  const drawW = state.image.naturalWidth * scale;
  const drawH = state.image.naturalHeight * scale;
  const x = (canvas.width - drawW) / 2 + state.offsetX;
  const y = (canvas.height - drawH) / 2 + state.offsetY;
  ctx.drawImage(state.image, x, y, drawW, drawH);
  syncTransformControls();
}

function setCanvasSize(width, height) {
  const ratioX = width / canvas.width;
  const ratioY = height / canvas.height;
  canvas.width = width;
  canvas.height = height;
  state.offsetX *= ratioX;
  state.offsetY *= ratioY;
  renderCrop();
}

async function blobToImage(blob, label) {
  if (!blob.type.startsWith("image/")) throw new Error(`The selected source is ${blob.type || "not an image"}.`);
  revokeObjectUrl();
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.decoding = "async";
  const loaded = new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error("The image could not be decoded."));
  });
  image.src = url;
  await loaded;
  state.imageObjectUrl = url;
  state.image = image;
  state.sourceLabel = label;
  $("#preview-source-label").textContent = `${label} · ${image.naturalWidth}×${image.naturalHeight}`;
  resetTransform();
  setStatus(`Loaded ${label} (${image.naturalWidth} × ${image.naturalHeight}). Drag the card to position the crop.`, "ok");
}

async function loadImageFromUrl(rawUrl, { label = null } = {}) {
  const url = normaliseImageUrl(rawUrl);
  if (!url) throw new Error("Paste a direct image URL first.");
  setStatus("Loading image URL…");
  let response;
  try {
    response = await fetch(url, { mode: "cors", credentials: "omit", cache: "no-store" });
  } catch (error) {
    throw new Error("That image host blocks browser access (CORS). Save the image and use Upload / choose photo instead.");
  }
  if (!response.ok) throw new Error(`Image request failed (${response.status}). Try uploading the image instead.`);
  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) throw new Error("That URL returned a webpage rather than an image. Paste the direct image URL, or upload the photo.");
  await blobToImage(blob, label ?? `URL: ${new URL(url).hostname}`);
}

function normaliseImageUrl(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return "";
  if (text.startsWith("data:image/") || text.startsWith("blob:")) return text;
  let url;
  try { url = new URL(text); } catch { throw new Error("That is not a valid URL."); }
  const host = url.hostname.toLowerCase();
  if (host.includes("google.")) {
    for (const key of ["imgurl", "mediaurl", "image_url"]) {
      const candidate = url.searchParams.get(key);
      if (candidate) return decodeURIComponent(candidate);
    }
  }
  return url.href;
}

async function loadCurrentArtwork() {
  if (!state.card) return;
  const path = artworkFor(state.card);
  if (!path) return;
  try {
    const response = await fetch(assetUrl(path));
    if (!response.ok) throw new Error(`Current art returned ${response.status}`);
    await blobToImage(await response.blob(), `Current art: ${state.card.name}`);
  } catch (error) {
    setStatus(`Could not load current artwork: ${error.message}`, "error");
  }
}

function fileFromDrop(event) {
  return [...(event.dataTransfer?.files ?? [])].find(file => file.type.startsWith("image/"));
}

function renderToExportCanvas() {
  if (!state.image) throw new Error("Load an image first.");
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;
  const exportCtx = exportCanvas.getContext("2d", { alpha: false });
  exportCtx.fillStyle = "#111";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
  const base = Math.max(exportCanvas.width / state.image.naturalWidth, exportCanvas.height / state.image.naturalHeight);
  const scale = base * state.zoom;
  const drawW = state.image.naturalWidth * scale;
  const drawH = state.image.naturalHeight * scale;
  const x = (exportCanvas.width - drawW) / 2 + state.offsetX;
  const y = (exportCanvas.height - drawH) / 2 + state.offsetY;
  exportCtx.drawImage(state.image, x, y, drawW, drawH);
  return exportCanvas;
}

function canvasToWebp(exportCanvas, quality) {
  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(blob => {
      if (!blob) return reject(new Error("The browser could not create a WebP file."));
      if (blob.type !== "image/webp") return reject(new Error("This browser did not encode WebP. Try a current Safari, Chrome or Edge build."));
      resolve(blob);
    }, "image/webp", quality);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function generatedManifestText() {
  const cards = Object.entries(state.cardOverrides).sort(([a], [b]) => a.localeCompare(b));
  const stars = Object.entries(state.superstarOverrides).sort(([a], [b]) => a.localeCompare(b));
  const lines = [
    "// WWE Legacy card-art manifest.",
    "// Generated by tools/card-art-studio.html.",
    "// Exact card entries override temporary wrestler/generic fallbacks.",
    "export const cardArtOverrides = {",
    ...cards.map(([id, path]) => `  ${JSON.stringify(id)}: ${JSON.stringify(path)},`),
    "};",
    "",
    "// Optional wrestler-wide defaults used while individual cards await unique art.",
    "export const superstarArtOverrides = {",
    ...stars.map(([id, path]) => `  ${JSON.stringify(id)}: ${JSON.stringify(path)},`),
    "};",
    "",
  ];
  return lines.join("\n");
}

function registerCurrentExport() {
  const path = currentDestination();
  if ($("#wrestler-default").checked && state.card?.superstarId) {
    state.superstarOverrides[state.card.superstarId] = path;
  } else if (state.card) {
    state.cardOverrides[state.card.id] = path;
  }
  updateDestinationUi();
}

async function ensureDirectory(root, parts) {
  let dir = root;
  for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true });
  return dir;
}

async function writeProjectFile(relativePath, blobOrText) {
  if (!state.projectRoot) throw new Error("No project folder is connected.");
  const parts = relativePath.split("/").filter(Boolean);
  const filename = parts.pop();
  const dir = await ensureDirectory(state.projectRoot, parts);
  const file = await dir.getFileHandle(filename, { create: true });
  const writer = await file.createWritable();
  await writer.write(blobOrText);
  await writer.close();
}

async function exportArtwork() {
  if (!state.card) return setExportStatus("Choose a card first.", "error");
  if (!state.image) return setExportStatus("Load a photo first.", "error");
  setExportStatus("Encoding WebP…");
  try {
    const quality = Number($("#quality").value) / 100;
    const blob = await canvasToWebp(renderToExportCanvas(), quality);
    registerCurrentExport();
    state.sessionExportedCount += 1;
    const path = currentDestination();
    const filename = path.split("/").at(-1);
    const manifest = generatedManifestText();
    const kb = (blob.size / 1024).toFixed(1);
    if (state.projectRoot) {
      await writeProjectFile(path, blob);
      await writeProjectFile("js/data/card-art-overrides.js", manifest);
      setExportStatus(`Saved ${path} (${kb} KB) and updated js/data/card-art-overrides.js automatically.`, "ok");
    } else {
      downloadBlob(blob, filename);
      setExportStatus(`Downloaded ${filename} (${kb} KB). Put it at ${path}. The manifest entry is ready below, or use Download Updated Manifest.`, "ok");
    }
  } catch (error) {
    setExportStatus(error.message, "error");
  }
}

function downloadManifest() {
  if (state.sessionExportedCount < 1) return setExportStatus("Export at least one WebP first so the manifest cannot point to a missing file.", "error");
  const blob = new Blob([generatedManifestText()], { type: "text/javascript;charset=utf-8" });
  downloadBlob(blob, "card-art-overrides.js");
  setExportStatus("Downloaded card-art-overrides.js. Replace js/data/card-art-overrides.js in the project with this file.", "ok");
}

async function connectProjectFolder() {
  if (!("showDirectoryPicker" in window)) {
    $("#project-status").textContent = "Direct folder writing is not supported in this browser. Export will download the WebP and manifest instead.";
    return;
  }
  try {
    const root = await window.showDirectoryPicker({ mode: "readwrite" });
    state.projectRoot = root;
    $("#project-status").textContent = `Connected: ${root.name}. Exports will now write directly into the game and update the manifest.`;
    $("#connect-project").textContent = "Project Folder Connected";
  } catch (error) {
    if (error?.name !== "AbortError") $("#project-status").textContent = `Could not connect folder: ${error.message}`;
  }
}

function pointerDistance() {
  const points = [...state.pointerMap.values()];
  if (points.length < 2) return null;
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
}

function onPointerDown(event) {
  if (!state.image) return;
  frame.setPointerCapture?.(event.pointerId);
  state.pointerMap.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (state.pointerMap.size === 1) {
    state.dragPointerId = event.pointerId;
    state.dragLast = { x: event.clientX, y: event.clientY };
  } else if (state.pointerMap.size === 2) {
    state.lastPinchDistance = pointerDistance();
    state.dragPointerId = null;
    state.dragLast = null;
  }
}

function onPointerMove(event) {
  if (!state.pointerMap.has(event.pointerId) || !state.image) return;
  const previous = state.pointerMap.get(event.pointerId);
  state.pointerMap.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const rect = canvas.getBoundingClientRect();
  if (state.pointerMap.size >= 2) {
    const distance = pointerDistance();
    if (distance && state.lastPinchDistance) {
      const ratio = distance / state.lastPinchDistance;
      state.zoom = Math.max(1, Math.min(4, state.zoom * ratio));
      state.lastPinchDistance = distance;
      renderCrop();
    }
    return;
  }
  if (state.dragPointerId === event.pointerId && state.dragLast) {
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    state.offsetX += (event.clientX - state.dragLast.x) * scaleX;
    state.offsetY += (event.clientY - state.dragLast.y) * scaleY;
    state.dragLast = { x: event.clientX, y: event.clientY };
    renderCrop();
  } else if (previous) {
    state.dragLast = { x: event.clientX, y: event.clientY };
  }
}

function onPointerUp(event) {
  state.pointerMap.delete(event.pointerId);
  if (state.pointerMap.size < 2) state.lastPinchDistance = null;
  if (state.pointerMap.size === 1) {
    const [id, point] = state.pointerMap.entries().next().value;
    state.dragPointerId = id;
    state.dragLast = { ...point };
  } else if (state.pointerMap.size === 0) {
    state.dragPointerId = null;
    state.dragLast = null;
  }
}

function wireEvents() {
  $("#set-filter").addEventListener("change", refreshCardList);
  $("#kind-filter").addEventListener("change", refreshCardList);
  $("#card-search").addEventListener("input", refreshCardList);
  $("#card-select").addEventListener("change", event => selectCard(event.target.value, { loadCurrent: true }));
  $("#load-url").addEventListener("click", async () => {
    try { await loadImageFromUrl($("#image-url").value); }
    catch (error) { setStatus(error.message, "error"); }
  });
  $("#image-url").addEventListener("keydown", event => { if (event.key === "Enter") $("#load-url").click(); });
  $("#use-current").addEventListener("click", loadCurrentArtwork);
  $("#image-file").addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { await blobToImage(file, `Upload: ${file.name}`); }
    catch (error) { setStatus(error.message, "error"); }
  });

  const drop = $("#drop-zone");
  ["dragenter", "dragover"].forEach(type => drop.addEventListener(type, event => { event.preventDefault(); drop.classList.add("is-dragging"); }));
  ["dragleave", "drop"].forEach(type => drop.addEventListener(type, event => { event.preventDefault(); drop.classList.remove("is-dragging"); }));
  drop.addEventListener("drop", async event => {
    const file = fileFromDrop(event);
    if (!file) return setStatus("The dropped item was not an image.", "error");
    try { await blobToImage(file, `Drop: ${file.name}`); }
    catch (error) { setStatus(error.message, "error"); }
  });
  window.addEventListener("paste", async event => {
    const item = [...(event.clipboardData?.items ?? [])].find(entry => entry.type.startsWith("image/"));
    const file = item?.getAsFile();
    if (!file) return;
    event.preventDefault();
    try { await blobToImage(file, "Clipboard image"); }
    catch (error) { setStatus(error.message, "error"); }
  });

  $("#zoom").addEventListener("input", event => { state.zoom = Number(event.target.value) / 100; renderCrop(); });
  $("#offset-x").addEventListener("input", event => { state.offsetX = Number(event.target.value); renderCrop(); });
  $("#offset-y").addEventListener("input", event => { state.offsetY = Number(event.target.value); renderCrop(); });
  $("#auto-center").addEventListener("click", () => { state.offsetX = 0; state.offsetY = 0; renderCrop(); });
  $("#reset-crop").addEventListener("click", resetTransform);
  $("#quality").addEventListener("input", event => { $("#quality-value").textContent = `${event.target.value}%`; });
  $("#output-size").addEventListener("change", () => { const { width, height } = outputDimensions(); setCanvasSize(width, height); });
  $("#wrestler-default").addEventListener("change", updateDestinationUi);
  $("#connect-project").addEventListener("click", connectProjectFolder);
  $("#export-webp").addEventListener("click", exportArtwork);
  $("#download-manifest").addEventListener("click", downloadManifest);

  frame.addEventListener("pointerdown", onPointerDown);
  frame.addEventListener("pointermove", onPointerMove);
  frame.addEventListener("pointerup", onPointerUp);
  frame.addEventListener("pointercancel", onPointerUp);
  frame.addEventListener("wheel", event => {
    if (!state.image) return;
    event.preventDefault();
    state.zoom = Math.max(1, Math.min(4, state.zoom * (event.deltaY < 0 ? 1.06 : 0.94)));
    renderCrop();
  }, { passive: false });
}

if (!("showDirectoryPicker" in window)) {
  $("#project-status").textContent = "This browser cannot write directly into a project folder. Export will download correctly named files instead.";
}

populateFilters();
wireEvents();
