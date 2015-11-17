const snakeskin = require('snakeskin/dist/snakeskin.live.min.js');

const tpls = require('./tpls/article.ss').init(snakeskin);

document.getElementById('content').innerHTML = tpls.article(
	'Example',
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eget vehicula enim. Nullam a nibh id velit auctor tincidunt. Integer lobortis, turpis nec tristique tempor, turpis elit molestie elit, id accumsan odio lacus a neque. Phasellus efficitur, magna eget euismod ullamcorper, elit urna sollicitudin mauris, ac eleifend risus erat placerat mi. Praesent ac metus dapibus ligula elementum dignissim et eget metus. Vivamus vitae dolor nec ligula dignissim dapibus. Curabitur efficitur est non luctus scelerisque. Quisque sit amet imperdiet ex. Curabitur leo magna, placerat vel lectus vitae, imperdiet auctor felis. Nulla a urna a tellus eleifend varius imperdiet at turpis. Donec efficitur risus pellentesque cursus accumsan. Morbi pulvinar cursus tempor. Mauris pellentesque vitae nulla ut interdum. Nulla dictum nunc nec tincidunt venenatis.'
)
