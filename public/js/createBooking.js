
const btnOrder = document.getElementById('btn-order')
btnOrder.addEventListener('click', async e => {
    e.preventDefault()
    const productId = btnOrder.dataset.productid
    const coustomerId = btnOrder.dataset.coustomerid
    const price = btnOrder.dataset.price

    data = {
        productId,
        coustomerId,
        price
    }

    try {
        const url = `/api/v1/booking/createBooking`
        const res = await axios({
            method: 'POST',
            url: url,
            data
        });
        if (res.data.status === 'success') {
            showAlert('success', 'Order successful')
            location.location('/')
        };
    } catch (err) {
        showAlert('error', err.response.data.message)
    }
})
