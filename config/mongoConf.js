var mongoose = require('mongoose');
var schedule = require('node-schedule');

mongoose.connect('mongodb://localhost/new_db', {useNewUrlParser: true, useUnifiedTopology: true });

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    code: String,
    valid: Number
},{collection: 'users'});

var User = mongoose.model("User", userSchema);

mongoose.connection.once('open',() => {
    // 设置定时任务，每隔1分钟删掉没有注册且验证码失效的记录
    schedule.scheduleJob('15 * * * * *', () => {
        User.deleteMany({valid: {"$lt": new Date().getTime()/1000 -180}}, (err, res) => {
        });
    });
});

module.exports = {
    User
}