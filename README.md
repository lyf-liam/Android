# HZNU官网2.0

## 技术栈：
- NODE.JS
- HTML
- JavaScript
- CSS
- MYSQL5.7
- Mongodb4.2
- Linux
--- 
## 数据字典
### User表
|字段名|类型|含义|约束|备注|
| :--------: | :---: | :----: | :--------: | :--------:|
| id | int | 记录id | Primary_Key(id) | |
| username | varchar(64) | 用户名| | |
| password | varchar(128) | 用户密码 | |
| type | int | 用户类型 | | 1-学生 2-教师 3-管理员 4-校友 |

### Info表
|字段名|类型|含义|约束|备注|
| :--------: | :---: | :----: | :--------: | :--------:|
| id | int | 记录id | Primary_Key(id) | |
| realname | varchar(64) | 用户名 |  |  |
| sex | int | 性别 | | 1-男/2-女 |
| email | varchar(128) | 邮箱 |  | |
| uid | int | 记录id | Foreign_Key(user) | |

### News
|字段名|类型|含义|约束|备注|
| :--------: | :---: | :----: | :--------: | :--------:|
| id | int | 记录id | Primary_Key(id) | |
| title | varchar(128) | 用户密码 | | |
| content | text | 内容 |  | |
| type | int | 类型 |  | 1-师大要闻/2-通知公告/3-学术报告 |
| date | Date | 发布日期 |  | |
| status | int | 状态 |  | 1-发布/2-编辑/3-软删除 |

### Alumnus表
|字段名|类型|含义|约束|备注|
| :--------: | :---: | :----: | :--------: | :--------:|
| id | int | 记录id | Primary_Key(id) | |
| name | varchar(128) | 校友姓名 |  |  |
| email | varchar(128) | 邮箱 |  | |
| term | int | 届时年份 |  | |
| position | varchar(128) | 职业 |  | |
| location | varchar(128) | 地点 |  | |
| uid | int | 用户id | Foreign_Key(user) | |

--- 
## 采用服务端渲染

![未命名文件 _2_.jpg](https://i.loli.net/2020/01/06/velzY64UVq7xrJb.png)

--- 
## 功能点

### 首页
- 用户名登录
- 邮箱验证码注册
- 新闻查看

### 管理端
- 基本的CRUD
- 用户批量导入

### github OAuth2.0授权

![未命名文件 _3_.jpg](https://i.loli.net/2020/01/06/fxecawCHrptO139.png)
--- 
## 部分页面截图展示
![个人主页@2x.png](https://i.loli.net/2020/01/06/Zki5ntFalYrdqgp.png)

![杭师大.png](https://i.loli.net/2020/01/06/edcwVJYCivXuKQm.png)

