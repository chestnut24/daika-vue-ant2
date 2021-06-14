export const filter = {
    install (Vue, options) {
        Vue.directive('tableff', {
            // 当被绑定的元素插入到 DOM 中时……
            inserted: function (el) {
                console.log(el)
                el.style.backgroundColor = 'red';
                var newGraf =document.createElement("p");
                newGraf.innerHTML=`<a-button>1231231</a-button>`
                el.appendChild(newGraf)
            },
            bind:function(name, value){
                console.log('binding.......', name, value)

            }
        })
    }
}
