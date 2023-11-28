const getGoods = () => {
    const links = document.querySelectorAll('.navigation-link');

    const getData = () => {
        fetch('https://wildberris-26b71-default-rtdb.firebaseio.com/db.json')
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('goods', JSON.stringify(data));
            })
    };

    if (!localStorage.getItem('goods')) {
        localStorage.setItem('goods', JSON.stringify([]))
    }

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            getData();

            const goods = JSON.parse(localStorage.getItem('goods'))

            console.log(goods);
        })
    });
};

getGoods();