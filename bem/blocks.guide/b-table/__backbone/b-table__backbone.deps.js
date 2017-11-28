module.exports = [
    { block: 'i-backbone' },
    {
        block : 'b-table',
        elem  : 'backbone',
        mods  : [
            'view',
            {
                mod : 'collection',
                val : 'data',
            },
            {
                mod : 'view',
                val : 'row', // 'pagination', 'sorting' подключаем по нужде
            },
        ],
    },
];
