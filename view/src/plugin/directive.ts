function loding(): HTMLElement {
    const loading = document.createElement('div')
    loading.innerHTML = `
<div class="file-loading">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>`
    loading.className = 'my-loading'
    loading.style.width = '100%'
    loading.style.height = '100%'
    loading.style.backgroundColor = 'rgba(255,255,255,0.5)'
    loading.style.position = 'absolute'
    loading.style.left = '0'
    loading.style.top = '0'
    loading.style.display = 'flex'
    loading.style.alignItems = 'center'
    loading.style.justifyContent = 'center'
    loading.style.zIndex = '99999'
    return loading
}


// 添加虚拟节点（如果不存在）
function addChild(el: Element, className: string) {
    let isClass = false
    let vnodes = Array.from(el.children)

    vnodes.forEach((el: Element) => {
        if (el.className === className) {
            isClass = true
        }
    })

    if (!isClass) {
        el.appendChild(el['vnode'])
    }

}

// 删除虚拟节点（如果存在）
function removeChild(el: Element, className: string) {
    let isClass = false
    let vnodes = Array.from(el.children)
    vnodes.forEach((el: Element) => {
        if (el.className === className) {
            isClass = true
        }
    })

    if (isClass) {
        el.removeChild(el['vnode'])
    }

}



function directive(instance: any) {
    instance.directive('load', {
        created(el: HTMLElement) {
            el['vnode'] = loding()
        },
        mounted(el: HTMLElement, binding: any) {
            if (binding.value) {
                addChild(el, 'my-loading')
            }
        },
        updated(el: any, binding: any) {
            if (binding.value) {
                addChild(el, 'my-loading')
            } else {
                removeChild(el, 'my-loading')
            }
        }
    })
}





export default directive