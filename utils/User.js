let response;
const userRequests = {

    getUserInfo: async () => {
        try {
            const value = await AsyncStorage.getItem('user_data');
            if (value !== null) {
                data = JSON.parse(value);
            } else {
                console.log("no user data");
            }
        } catch (error) {
            // Error retrieving data
        }
        return data;
    },

    setUserInfo: async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('user_data', jsonValue)
        } catch (e) {
            // save error
        }
    },

      getUserData : async (url, token) => {
        try {
            const request = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            }).then(response =>
                response.json()
            ).then(data => {
                if (data) {
                    // Verificar se existem erros 
                    if (data.success) {
                    } else {
                        alert("Erro a atualizar os dados do utilizador")
                    }
    
                }
            }).catch((error)=>{
                console.log(error);
            })
return JSON.parse(request);
        } catch (error) {
            // Error retrieving data
        }
    },
}

export default userRequests;