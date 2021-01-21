let Api = function(host){
    this.host = host;
    this.get = (query => {
        return fetch(host + query);
    })
}
export default new Api("http://localhost:8050");
