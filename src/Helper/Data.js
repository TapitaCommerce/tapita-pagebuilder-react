export const randomString = (charCount = 20) => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < charCount; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return btoa(text + Date.now());
}


export const listToTree = (list) => {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].entity_id] = i;
        list[i].children = [];
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parent_id !== 0) {
            list[map[node.parent_id]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}
