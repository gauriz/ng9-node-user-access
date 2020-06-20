
function findUsers(personID) {
    return new Promise((resolve, reject) => {
        try {
            resolve(req.app.locals.usersCollection.find().toArray());
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}