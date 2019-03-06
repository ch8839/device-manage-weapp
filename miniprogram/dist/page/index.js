Component({
    externalClasses: ['i-class'],

    options: {
        multipleSlots: true
    },

    properties: {
        // button || number || pointer
        mode: {
            type: String,
            value: 'button'
        },
        current: {
            type: Number,
            value: 1
        },
        total: {
            type: Number,
            value: 0
        },
        allpages:{
            type: Array,
            value: 0
        },
        // 是否隐藏数值
        simple: {
            type: Boolean,
            value: false
        }
    },

    methods: {
        handleChange (type) {
            this.triggerEvent('change', {
                type: type
            });
        },
        pageSelect2(page) {
            this.triggerEvent('select', {
            page: this.data.current
        });
        },
        handlePrev () {
            this.handleChange('prev');
        },
        handleNext () {
            this.handleChange('next');
        },
        pageSelect(e) {
          console.log('picker发送选择改变，携带值为', parseInt(e.detail.value) + 1);
          this.setData({
            current: parseInt(e.detail.value)+ 1
          });
          this.pageSelect2()
       },
    }
});
