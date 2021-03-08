module.exports = (function (){
    return [
        {
            'Id':'1',
            'Name':'Birthday Wish',
            'criteria':'User.Birthday BETWEEN 2/1/2021 AND 2/28/2021',
            'Message': 'Happy birthday ${Name}',
            active:true
        },
        {
            'Id':'2',
            'Name':'Send Message to people lives in Dallas and active now',
            'criteria':'User.City = "Dallas" AND Active = true',
            'Message': 'Dallas people gets 10%',
            active:true
        },

        {
            'Id':'3',
            'Name':'User last order date was an year ago',
            'criteria':'...',
            'Message': 'Please place an order to keep your status',
            active : true
        },

        {
            'Id':'4',
            'Name':'User Has more then 2 order count',
            'criteria':'...',
            'Message': '',
            active:false
        },

        {
            'Id':'5',
            'Name':'User reside in Canada',
            'criteria':'...',
            'Message': '',
            active : false
        },

        {
            'Id':'6',
            'Name':'Order Total Item count > 10',
            'criteria':'...',
            'Message': '',
            active : true
        }
    ];
})();