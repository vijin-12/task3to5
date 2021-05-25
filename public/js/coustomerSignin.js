const btnSignIn = document.getElementById('btn-signIn')



btnSignIn.addEventListener('click', async (e) => {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const passwordConfirm = document.getElementById("passwordConfirm").value
    const mobileNumber = document.getElementById("mobileNumber").value
    const addressLineOne = document.getElementById("addressLineOne").value
    const city = document.getElementById("city").value
    const state = document.getElementById("state").value
    const zip = document.getElementById("zip").value
    e.preventDefault()
    if(!name || !email || !password || !passwordConfirm || !mobileNumber ||
        !addressLineOne  || !state || !city ||  !zip){
        showAlert('error', 'please provide all the fields')
        return
	}
    const data = {
		name,
		email,
		password,
		passwordConfirm,
		mobileNumber,
		address: {
			addressLineOne,
			state,
			city,
			zip
		}

	}
    try {
        const url = `http://localhost:8821/api/v1/coustomer/signup`
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
