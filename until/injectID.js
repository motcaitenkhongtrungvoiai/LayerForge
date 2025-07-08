export  function injectId(node) {
  if (node.type === "layer") {
    node.id = "layer_" + layerIdCounter++;
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => injectId(child));
  }
}
