function createTree(arr, parentId ="") {
    const tree =[];
    arr.forEach(item => {
        if(parentId === item.parent_id){
            const children = createTree(arr, item.id);
            if(children.length > 0){
                item.children = children;
            }
            tree.push(item);
        }
    });
    return tree;
}

module.exports = (records) => {
    const tree = createTree(records);
    return tree;
} 