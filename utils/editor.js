// 富文本编辑器，创建编辑器函数，创建工具栏函数，引入wangEditor的css和js文件后，在全局暴露一个wangEditor属性
// 这里使用解构赋值获得创建editor和toolbar的函数对象
const { createEditor, createToolbar } = window.wangEditor

// 编辑器配置对象
const editorConfig = {
  // 占位提示字符
  placeholder: '请在这里输入内容...',
  // 编辑器内容、选区变化时的回调函数
  onChange(editor) {
    // 获取富文本内容
    const html = editor.getHtml()
    // console.log('editor content', html)
    // 也可以同步到 <textarea>，为了后续快速收集表单，<textarea>为一个隐藏的标签
    document.querySelector('.publish-content').innerHTML = html
  },
}

const editor = createEditor({
  // 编辑器创建位置，id选择器
  selector: '#editor-container',  
  // 编辑器的默认内容
  html: '<p><br></p>',            
  config: editorConfig,
  // 配置的是编辑区（选中文字有没有工具栏）
  mode: 'default', // or 'simple'
})

// 工具类配置对象
const toolbarConfig = {}

const toolbar = createToolbar({
  // 为指定编辑器创建工具栏
  editor,   
  // id选择器，工具栏的位置
  selector: '#toolbar-container', 
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})
