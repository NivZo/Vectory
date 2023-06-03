export const onHoverOrMouseDown = (node, callback) => {
    node.addEventListener('mouseover', callback)
    node.addEventListener('mousedown', callback)
    node.addEventListener('touchstart', callback)
  
    return {
      destroy() {
        node.removeEventListener('mouseover', callback)
        node.removeEventListener('mousedown', callback)
        node.removeEventListener('touchstart', callback)
      } 
    }
  };