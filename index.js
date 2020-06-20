async function getDocumentsWithCriteria(db, path, field, operation, criteria) {
    const query = db.collection(path).where(field || firestore.FieldPath.documentId(), operation, criteria);
    return await query.get()
        .then(querySnapshot => {
            const documents = getDocumentsFromQuerySnapshot(querySnapshot);
            if (documents.length > 0) {
                // console.log(`The following documents were successfully retrieved at path(${path}) where (${field} ${operation} ${criteria}): ${JSON.stringify(documents, null, 2)}`);
                return { path: path, id: null, data: documents, wasSuccessful: true, error: undefined };
            }
            else { return handleUnsuccessfulRetrieval(path, null, `No documents found at path(${path}) using (${field} ${operation} ${criteria})`); }
        }).catch((error) => { return handleUnsuccessfulRetrieval(path, null, error) })
}

function getDocumentsFromQuerySnapshot(querySnapshot) {
    const documents = [];
    querySnapshot.forEach(doc => {
        documents.push({...doc.data(), id: doc.id});
    });
    return documents;
}

function handleUnsuccessfulRetrieval(path, documentId, error) {
    console.error(`Error retrieving document(${documentId}) path(${path}). ERR: ${error}`);
    return { path: path, id: documentId, data: null, wasSuccessful: false, error: error };
}

module.exports = {
    getDocumentsWithCriteria: getDocumentsWithCriteria
}