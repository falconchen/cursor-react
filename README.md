## Getting Started

```
npm i
npm start
```


``` js
self:
script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=WXJBZ-2IS35-GPRIZ-QMI4R-4S6G2-SDBZQ';
```
``` js
script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77';
```

### 学习资料

next.js的官方基础教程，可以了解基本的概念和用法。
<https://nextjs.org/learn/dashboard-app>

这是 react 基础：
<https://nextjs.org/learn/react-foundations>

- React组件应该大写，以区别于普通HTML和JavaScript，如Header
- props 解构赋值写法
    ``` jsx
    //原：
    function Header(props) {
      return <h1>{props.title}</h1>;
    }
    //解构赋值写法：
    function Header({ title }) {
      console.log(title);
      return <h1>{title}</h1>;
    }
    //可以使用模板字符串：
    function Header({ title }) {
      return <h1>{`Cool ${title}`}</h1>;
    }
    //可以使用函数或
    function Header({ title }) {
      return <h1>{createTitle(title)}</h1>;
    }

    //可以使用三元运算符：
    function Header({ title }) {
      return <h1>{title ? title : 'Default Title'}</h1>;
    }
    // jsx 迭代
    // 使用 map 函数来迭代数组，并返回一个包含每个元素的列表项。
    /* 注意：
      1.每个列表项需要一个唯一的 key 属性，通常使用数组索引作为 key。
      2.使用箭头函数来返回每个列表项。
      3.要用{}包裹
      4.要返回一个元素包裹，如div、section、article等
    */
    function NoteList() {
      const notes = [
          { content: 'WiFi名: Xs\nWiFi密码: Mi******nh05', distance: 2.37 },
          { content: '启迪停车场', distance: 48.46, hasQR: true },
          { content: '世贸广场停车缴费', distance: 503.0, hasQR: true },
          { content: '门禁密码 *2254', distance: 2004.04 },
          { content: '青龙湖停车场', distance: 2304.05, hasQR: true },
        ];

        return (
          <div className="note-list">
            {notes.map((note, index) => (
              <NoteItem key={index} note={note} />
            ))}
          </div>
        );
      }  
      // 条件渲染
      function Item({ name, isPacked }) {
        if (isPacked) {
          return <li className="item">{name} ✅</li>;
        }
        return <li className="item">{name}</li>;
      }
      export default function PackingList() {
        return (
          <section>
            <h1>Sally Ride's Packing List</h1>
            <ul>
              <Item 
                isPacked={true} 
                name="Space suit" 
              />
              <Item 
                isPacked={true} 
                name="Helmet with a golden leaf" 
              />
              <Item 
                isPacked={false} 
                name="Photo of Tam" 
              />
            </ul>
          </section>
        );
      }

    ```




### 生产环境运行

编译
``` bash
npm run build
```

本地查看效果

安装 serve 组件

The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

``` bash
  npm install -g serve
  serve -s build
```

### cloudflare pages和functions集成

```
npx wrangler pages download config 下载当前项目设置到wrangler.toml文件`
```

```
npx wrangler pages dev
```

### D1数据库

wrangler.toml 配置
```
[[d1_databases]]
binding = "DB" # Should match preview_database_id
database_name = "geo-notes"
database_id = "4467aa4c-35ba-42c4-bdb1-5d7320299f15" # wrangler d1 info YOUR_DATABASE_NAME
preview_database_id = "DB" # 本地开发Pages所需
```

本地创建表或更新表结构

```
npx wrangler d1 execute geo-notes --local --file=./schema.sql
```


远程
```
npx wrangler d1 execute geo-notes --remote --file=./schema.sql
```

### KV

wrangler.toml 配置
```
[[kv_namespaces]]
binding = "KV" # 绑定名称 
id = "0396dc1650024136895e5c75eb72981e" # KV命名空间ID
```

要在本地通过向 Wrangler CLI 传递参数来与 KV 命名空间绑定进行交互，请在 wrangler pages dev 命令中添加 -k <BINDING_NAME> 或 --kv=<BINDING_NAME>。例如，如果您的 KV 命名空间通过 TODO_LIST 绑定与函数绑定，请通过运行以下命令在本地开发中访问 KV 命名空间：


npx wrangler pages dev <OUTPUT_DIR> --kv=TODO_LIST


### D1和KV数据库存放在项目的位置
`.wrangler/state`


### Functions线上日志

查看地址：<https://dash.cloudflare.com/c26825851fc0ddfe08ec8330213454ac/pages/view/cursor-react/765ed9ce-a834-4ae2-a922-634ed50df439/functions>

实时日志->开启日志流

![](https://photo.cellmean.com/i/2024/09/04/v5qhj-0.png)  


### 【本地开发】反代API路径

将本地的API代理到后端服务器 wrangler pages dev

这样访问本地的API，实际访问的是后端服务器 
<http://localhost:3001/api/check-login> 实际访问的是 <http://localhost:8788/api/check-login>

在 `src/setupProxy.js` 中配置代理

``` js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api', '/auth'],
    createProxyMiddleware({
      target: 'http://localhost:8788', // 修改为后端服务器wrangler pages dev 的地址
      changeOrigin: true,
    })
  );
};
```
