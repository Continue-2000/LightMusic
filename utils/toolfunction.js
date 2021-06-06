// 计算返回价格
export const FormatPrice = function (price) {
    if (price < 10000) {
        return price
    }
    else {
        price = Math.floor(price / 10000);
        if (price / 10000 < 1)
            price = price + '万'
        else
            price = Math.floor(price / 10000) + '亿'
    }
    return price
}