class ApiService {
   constructor(baseURL_) {
      let token = sessionStorage.getItem('idToken');
      if (token === null) {
         auth
            .signOut()
            .then(function() {})
            .then(function() {
               window.location = ('/');
            }).catch(function(error) {
               alert('An error happened.');
               console.log('Something went wrong:', error);
            });
      }
      this.service = axios.create({
         baseURL: baseURL_,
         headers: {
            'fb-auth-token': token
         },
         responseType: 'json'
      })
      this.isLoading = this.isLoading.bind(this);

      this.service.interceptors.response.use(function(response) {
         // Do something with response data
         console.log('response', response);
         return response;
      }, function(error) {
         // With response error redirect
         if (401 === error.response.status) {
            // wrong token -- access denied
            auth
               .signOut()
               .then(function() {})
               .then(function() {
                  window.location = ('/');
               }).catch(function(error) {
                  alert('An error happened.');
                  console.log('Something went wrong:', error);
               });
         }
         return Promise.reject(error);
     });
   }

    // getEditorsList() {
    //     return this.service.get('/auth/editors');
    // }

}