   let layerIdCounter=0;
 function injectId(node) {

  if (node.type === "layer") {
    node.id =  layerIdCounter++;
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => injectId(child));
  }
}
module.exports={injectId}