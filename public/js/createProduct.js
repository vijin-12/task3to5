let btnCreate = document.getElementById('btn-create')
let productUploadForm = document.getElementById('product-upload form')
btnCreate.addEventListener('click', async e => {
	e.preventDefault()
	
	let ProductName = document.getElementById('productName').value
	let file1 = document.getElementById('image').files[0]
    let price = document.getElementById('price').value
    let description = document.getElementById('description').value
    if(!price) return showAlert('error', 'price field is must')
	if(!ProductName) return showAlert('error', 'Product name should not be empty')
	if(!file1) return showAlert('error', 'image field is must')
	try{
		const url = '/api/v1/product/createProduct'
		let form = new FormData()
		form.append('productName', ProductName)
        form.append('image', file1)
        form.append('description', description)
        form.append('price', price)
		const res = await axios({
            method: 'POST',
            url: url,
            data: form
        });
		showAlert('success', 'Product added successfully')
		productUploadForm.reset()
        location.assign('/')
	}catch(err){
		console.log(err)
		showAlert('error', 'Error in uploading Product')
		productUploadForm.reset()
	}	
})