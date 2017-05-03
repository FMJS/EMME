// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 1;
      var x = new Int8Array(data.x_sab); x[2] = 1;
      var x = new Int8Array(data.x_sab); x[3] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = x[0]; report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = x[1]; report.push("id9_R_t3: "+id9_R_t3);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[1] = "id8_R_t3: 1;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 257;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 65537;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 65793;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 16777216;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 16777217;id9_R_t3: 0";
outputs[10] = "id8_R_t3: 16777472;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 16777473;id9_R_t3: 0";
outputs[12] = "id8_R_t3: 16842752;id9_R_t3: 0";
outputs[13] = "id8_R_t3: 16842753;id9_R_t3: 0";
outputs[14] = "id8_R_t3: 16843008;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 16843009;id9_R_t3: 0";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[17] = "id8_R_t3: 1;id9_R_t3: 1";
outputs[18] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[19] = "id8_R_t3: 257;id9_R_t3: 1";
outputs[20] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[21] = "id8_R_t3: 65537;id9_R_t3: 1";
outputs[22] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[23] = "id8_R_t3: 65793;id9_R_t3: 1";
outputs[24] = "id8_R_t3: 16777216;id9_R_t3: 1";
outputs[25] = "id8_R_t3: 16777217;id9_R_t3: 1";
outputs[26] = "id8_R_t3: 16777472;id9_R_t3: 1";
outputs[27] = "id8_R_t3: 16777473;id9_R_t3: 1";
outputs[28] = "id8_R_t3: 16842752;id9_R_t3: 1";
outputs[29] = "id8_R_t3: 16842753;id9_R_t3: 1";
outputs[30] = "id8_R_t3: 16843008;id9_R_t3: 1";
outputs[31] = "id8_R_t3: 16843009;id9_R_t3: 1";
outputs[32] = "id8_R_t3: 0;id9_R_t3: 256";
outputs[33] = "id8_R_t3: 1;id9_R_t3: 256";
outputs[34] = "id8_R_t3: 256;id9_R_t3: 256";
outputs[35] = "id8_R_t3: 257;id9_R_t3: 256";
outputs[36] = "id8_R_t3: 65536;id9_R_t3: 256";
outputs[37] = "id8_R_t3: 65537;id9_R_t3: 256";
outputs[38] = "id8_R_t3: 65792;id9_R_t3: 256";
outputs[39] = "id8_R_t3: 65793;id9_R_t3: 256";
outputs[40] = "id8_R_t3: 16777216;id9_R_t3: 256";
outputs[41] = "id8_R_t3: 16777217;id9_R_t3: 256";
outputs[42] = "id8_R_t3: 16777472;id9_R_t3: 256";
outputs[43] = "id8_R_t3: 16777473;id9_R_t3: 256";
outputs[44] = "id8_R_t3: 16842752;id9_R_t3: 256";
outputs[45] = "id8_R_t3: 16842753;id9_R_t3: 256";
outputs[46] = "id8_R_t3: 16843008;id9_R_t3: 256";
outputs[47] = "id8_R_t3: 16843009;id9_R_t3: 256";
outputs[48] = "id8_R_t3: 0;id9_R_t3: 257";
outputs[49] = "id8_R_t3: 1;id9_R_t3: 257";
outputs[50] = "id8_R_t3: 256;id9_R_t3: 257";
outputs[51] = "id8_R_t3: 257;id9_R_t3: 257";
outputs[52] = "id8_R_t3: 65536;id9_R_t3: 257";
outputs[53] = "id8_R_t3: 65537;id9_R_t3: 257";
outputs[54] = "id8_R_t3: 65792;id9_R_t3: 257";
outputs[55] = "id8_R_t3: 65793;id9_R_t3: 257";
outputs[56] = "id8_R_t3: 16777216;id9_R_t3: 257";
outputs[57] = "id8_R_t3: 16777217;id9_R_t3: 257";
outputs[58] = "id8_R_t3: 16777472;id9_R_t3: 257";
outputs[59] = "id8_R_t3: 16777473;id9_R_t3: 257";
outputs[60] = "id8_R_t3: 16842752;id9_R_t3: 257";
outputs[61] = "id8_R_t3: 16842753;id9_R_t3: 257";
outputs[62] = "id8_R_t3: 16843008;id9_R_t3: 257";
outputs[63] = "id8_R_t3: 16843009;id9_R_t3: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3T2PHMcRgOHcv4KhCQjg3vZ87NpwYMEQnNgG5MAhYYAOCFiWAyoy9N9NihR14g5nrmf7i9NPdpi9
//5R6ad+9bVV3d9eLF9z+8+e8Pb168ePb61eXlty/fhN89O/3+9avrz1+/ePHd96/+9e+33/Dnr5/94dn/
//fvv61fnlP16+efjq7TvCT189/+rZr54Oj56Gxafju6/P755OP3316dP50dNp8en7n/Xd0/c/6funD2+/
//47t/vv7Pu+fnR5/3+Hn4zPPhM8/HR5/6+Pn0mefzZ55fPvNzfvj5f3z2x7/+6dlf/maN863xJ2v4+FN/
//eTotPp0Xn14W/93HnxYWPy0sflpY/LSw+Glh8dOGxU8bFj9tWPy0YfHThsVP++V36bL49PH3TovfOy1+
//77z4vfOn3/v+L+bbr7/56U/mV7+vP//fv33n6d27P/fiw9qL57UXw4cXr2vvvC6/88MP/s2HP/XFf3/5
//3e/f+fd/vHvnj795sQTvB/AGb/AG7yPA+34+//Lix1/3U350L3zqbqCfxwnSIR3SIf3w8Xgk0j/+Wj+U
//RHpIgPQZ0iEd0iH9CEi/NxCvDfTHf2IpMT+NYxC7Az3QA33ntfRbC3z89T2XRP2QBOqid1AHdVA/fo09
//Knqvg/Tl6D0F6OfrGeiBHuiB/vDR+xOK67VBHzKCPgA90AM90B8B9PeV3NuM53PBX3cN9EM/9OuuuXnx
//46IW3Yx9/F+puwbSrTGk665JEurXAfpyPH8/5tXngR7ogb7X+vxNdaY26IeMoFefB3qgB/r+6vPNYX67
//3yYt/PXQgz/4g78e+psXPy5f0Q3aKQnU1ehBHdRBXQ99A0hfjuknNXqgt8ZAD/Tpe+jrgD5kBL0aPdAD
//PdDroW80ng+ifPC3xuAP/kmj/Jt92Nr4Hxf/IEX5QG+NgR7oE7XPtxnl54L/wzTP8/lBMw7+4z/+Gw71
//yYsfFyqUdMCciuv6cXAd13G9x7lRK0F/HaovR/aJWD/MivVYj/VY3+OVNyt7tXVYH/KyXr0e67Ee6w96
//F86+rpyWovp8/L8M53kU6+M//uN/j/X6lbsT6hhgyMt6sT7WYz3WH7SGv++WnJZi/Zz8D6fTBf/xH//x
///5ixfsyokjar+pn5f8V//Md//P9i+Z9oUFUp+u+dVaWnB/utMfZjf5KenpWTWXWi/+UzWHp6sN4aYz3W
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
//fsAI1pgRGCFVftCaD/ZOJEtng/8DkO+zYQ==
