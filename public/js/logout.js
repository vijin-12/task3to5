async function logOut(){
	let url = '/api/v1/coustomer/logout'
	try {
        const res = await axios({
            method: 'GET',
            url: url,
        });

        if (res.data.status === 'success') {// status is that we provided in our api
            showAlert('success', 'logged out successfully')  
            location.assign('/') // redirect to home page
        };
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}
