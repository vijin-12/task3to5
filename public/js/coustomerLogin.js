const btnLogIn = document.getElementById('btn-logIn')


btnLogIn.addEventListener('click', async (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    
    if(!email || !password){
        showAlert('error', 'please provide all the fields')
        return
	}
    const data = {
		email,
		password
	}
    try {
        const url = `http://localhost:8821/api/v1/coustomer/login`
        const res = await axios({
            method: 'POST',
            url: url,// only work if they are hosted in same platform or else you should type the full url link like this http://127.0.0.1:3000/api/v1/users/login
            data
        });
        if (res.data.status === 'success') {// status is that we provided in our api
            showAlert('success', 'logged in successfully')
            location.assign('/') // redirect to home page
        };
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
})
