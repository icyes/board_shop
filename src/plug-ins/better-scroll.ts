import Vue from 'vue'
import BScroll from '@better-scroll/core'


Vue.prototype.$createBsFactory= function(wrapper:any){
    return new BScroll(wrapper, {
        scrollY: true,
        click: true,
        probeType: 3 // listening scroll hook
    })
}
