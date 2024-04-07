module.exports = (req, countRecords) => {
    const objectPagination = {
        currentPage: 1,
        limitPage: 4
    }

    if(req.query.page){
        objectPagination.currentPage = parseInt(req.query.page);
    }
    const skipPage = (objectPagination.currentPage - 1) * objectPagination.limitPage;
    objectPagination.skipPage = skipPage;
    objectPagination.totalPage = Math.ceil(countRecords/objectPagination.limitPage);
    return objectPagination;
}