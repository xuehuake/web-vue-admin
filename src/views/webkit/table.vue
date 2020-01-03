<template>
  <div class="mixin-components-container">
    <el-row
      :gutter="20"
      style="margin-top:50px;"
    >
      <!-- excel导出 -->
      <el-col :span="18">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span>导出代码生成</span>
          </div>
          <div>
            <el-form>
              <el-form-item prop="Name">
                <md-input
                  v-model="exportModel.Name"
                  icon="el-icon-search"
                  name="Name"
                  placeholder="输入名称"
                >名称</md-input>
              </el-form-item>
              <el-form-item prop="Html">
                HTML
                <div class="editor-container">
                  <json-editor v-model="exportModel.Html" />
                </div>
              </el-form-item>
              <el-form-item
                v-show="exportModel.Code"
                prop="result"
              >
                <label for="result">结果</label>
                <aside name="result">
                  <textarea
                    style="min-height: 500px;width:100%"
                    readonly="readonly"
                    v-text="exportModel.Code"
                  />
                </aside>
              </el-form-item>
              <el-button v-waves :loading="loading" type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="GennerExportCode">生&nbsp;成</el-button>

            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row></div>
</template>
<script>
import MdInput from '@/components/MDinput'
import JsonEditor from '@/components/JsonEditor'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  components: {
    MdInput, JsonEditor
  },
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      exportModel: {
        Name: null,
        Html: null,
        Code: null
      },
      tableHeader: `string mFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls";
                        Response.AppendHeader("Content-Disposition", "attachment;filename=" + Server.HtmlEncode(mFileName) + "");
                        Response.ContentEncoding = System.Text.Encoding.UTF8;
                        Response.Write("<meta http-equiv=Content-Type content=application/ms-excel;charset=UTF-8>");
                        System.IO.StringWriter writer = new System.IO.StringWriter();`
    }
  },
  activated() {
  },
  methods: {
    ConvertRows(fieldArr, fieldStr) {
      var arr = []
      var reg = /Eval\("(.*?)"\)/g
      var match = reg.exec(fieldStr)
      while (match != null) {
        const fieldName = match[1].trim()
        arr.push(fieldName)
        match = reg.exec(fieldStr)
      }
      var tmpStr = fieldStr
      tmpStr = tmpStr.replace(/<%#/g, '{').replace(/%>/g, '}')
      var field = ''; var objConvert = null; var rowConvert = null
      var set = [...new Set(arr)]
      if (set.length === 1) {
        field = arr[0]
        var objConvertReg = new RegExp(`Eval\\("${field}"\\)`, 'g')
        objConvert = `obj=>$"${tmpStr.replace(objConvertReg, 'obj')}"`
      } else {
        for (let index = 0; index < set.length; index++) {
          const element = set[index]
          var rowConvertReg = new RegExp(`Eval\\("${element}"\\)`, 'g')
          tmpStr = tmpStr.replace(rowConvertReg, `row["${element}"]`)
        }
        rowConvert = `row=>$"${tmpStr}"`
      }
      return {
        field,
        objConvert,
        rowConvert
      }
    },
    ConvertRow(str) {
      if (/^Eval\("([a-zA-Z\d_]+)"\)$/.test(str)) {
        return {
          field: /^Eval\("([a-zA-Z\d_]+)"\)$/.exec(str)[1],
          objConvert: null,
          rowConvert: null
        }
      }
      var arr = []
      var reg = /Eval\("(.*?)"\)/g
      var match = reg.exec(str)
      while (match != null) {
        const fieldName = match[1].trim()
        // if (!arr.some(s => s === fieldName)) {
        arr.push(fieldName)
        // }
        match = reg.exec(str)
      }

      var field = ''; var objConvert = null; var rowConvert = null
      if (arr.length === 1) {
        // objConvert
        field = arr[0]
        var objConvertReg = new RegExp(`Eval\\("${field}"\\)`, 'g')
        objConvert = `obj=>${str.replace(objConvertReg, 'obj')}`
      } else if (arr.length > 1) {
        // rowConvert
        var tmpStr = str
        for (let index = 0; index < arr.length; index++) {
          const element = arr[index]
          var rowConvertReg = new RegExp(`Eval\\("${element}"\\)`, 'g')
          tmpStr = tmpStr.replace(rowConvertReg, `row["${element}"]`)
        }
        rowConvert = `row=>${tmpStr}`
      }
      return {
        field,
        objConvert,
        rowConvert
      }
    },
    ConvertField(fieldStr) {
      const vm = this
      var arr = []
      var reg = /<%#(.*?)%>/g
      var match = reg.exec(fieldStr)
      while (match != null) {
        arr.push(match[1].trim())
        match = reg.exec(fieldStr)
      }
      if (arr.length === 1) {
        return vm.ConvertRow(arr[0])
      } else if (arr.length > 1) {
        return vm.ConvertRows(arr, fieldStr)
      }
      return {
        field: '',
        objConvert: null,
        rowConvert: null
      }
    },
    GennerExportCode() {
      const vm = this
      vm.loading = true
      let str = `\n\tvar table = datas.Tables[0].ToHtmlTable(new List<(string, string, Func<object, string>, Func<DataRow, string>)>`
      str += '\n\t{\n'
      var html = vm.exportModel.Html || ''
      html = html.replace(/\n/g, '').replace(/\t/g, '')

      var headerArr = []
      var headerReg = /<th.*?>(.*?)<\/th>/g
      var headerMatch = headerReg.exec(html)
      while (headerMatch != null) {
        headerArr.push(headerMatch[1])
        headerMatch = headerReg.exec(html)
      }

      var bodyArr = []
      var bodyReg = /<td.*?>(.*?)<\/td>/g
      var bodyMatch = bodyReg.exec(html)
      while (bodyMatch != null) {
        bodyArr.push(bodyMatch[1].trim())
        bodyMatch = bodyReg.exec(html)
      }

      var selectIndex = headerArr.indexOf('选择')
      if (selectIndex > -1) {
        headerArr.splice(selectIndex, 1)
        bodyArr.splice(selectIndex, 1)
      }
      var optionIndex = headerArr.indexOf('操作')
      if (optionIndex > -1) {
        headerArr.splice(optionIndex, 1)
        bodyArr.splice(optionIndex, 1)
      }

      const len = headerArr.length
      var fieldArr = []
      for (var i = 0; i < len; i++) {
        var title = headerArr[i]
        var obj = vm.ConvertField(bodyArr[i])
        var field = obj.field
        var objConvert = obj.objConvert
        var rowConvert = obj.rowConvert
        fieldArr.push(`\t\t("${title}","${field}",${objConvert},${rowConvert})`)
      }
      str += fieldArr.join(',\n')
      str += '\n\t})'
      let code = `\tif (Utils.DataSetIsNull(datas))
        {
            JscriptMsg("没有可供导出的数据！", "back", "Error");
            return;
        }
        string mFileName = $"${vm.exportModel.Name}{DateTime.Now.ToString("yyyyMMddHHmmss")}.xls";
        Response.AppendHeader("Content-Disposition", "attachment;filename=" + Server.HtmlEncode(mFileName) + "");
        Response.ContentEncoding = System.Text.Encoding.UTF8;
        Response.Write("<meta http-equiv=Content-Type content=application/ms-excel;charset=UTF-8>");
        System.IO.StringWriter writer = new System.IO.StringWriter();
       `

      code += `${str};`
      code += `\n\tResponse.Write(table);\n\tResponse.End();`
      vm.exportModel.Code = code
      vm.loading = false
    }
  }
}
</script>
<style>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
aside {
  background: #eef1f6;
  padding: 8px 24px;
  margin-bottom: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* word-wrap:break-word */
}
</style>
