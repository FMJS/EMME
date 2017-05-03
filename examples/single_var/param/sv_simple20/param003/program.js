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
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 0;
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
outputs[1] = "id8_R_t3: 2;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 514;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 131074;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 131586;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[9] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[11] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[12] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[13] = "id8_R_t3: 131074;id9_R_t3: 2";
outputs[14] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[15] = "id8_R_t3: 131586;id9_R_t3: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3U1vHMcRgOF7fgWPEWCAIme5KybIIUZg5JIEcA4+CgaUg4A4zkE+Bf7v0ZelpbY5w+7prm7NPDdi
//lqslSuT7VldXd11f//zLm//+8ub6+ur1qxcvv3/5ZvrD1fM/vn51/9vX19c//fzqX/9++w1//fbqT1f/
//+/3rV7cvf3j55uabt++Y3n/17JurB08PZ0+n5NO7d1/fvnt6fP/Vl09PZ0+PyacfftZ3Tz/8pB+e3rz9
//jp9+fP2fd89vzz7v/Pn0yPPDI8/vzj71/PnxkeenR56/eOTn/Pjz/3r157//5epv/xDjdjH+Iobnn/r5
//6TH59JR8+iL5755/2pT8tCn5aVPy06bkp03JTzskP+2Q/LRD8tMOyU87JD/t8+/Si+TT8+89Jr/3mPze
//U/J7T19+74e/mO+//e79n8yD39ff/u/fvvP5u3c/9uLN3Iu3cy9OH1+8n3vnffqdH3/w7z7+qSf//fS7
//P7zznz+8e+evv7tOwfsWvMEbvMF7C/Bez+fPL376dX/eHt2JTy0G+t0NpEM6pEP69vPxTKR/+rW+iUT6
//VAHpB0iHdEiH9C0gfW0i3hvo539iNTF/M908P0nekR7pkX7nxfRLDXz69b2NZP2hDtXl76iO6qi+/Sp7
//Vv7eh+np/L0K6e9eID3SIz3Sbz9/f0J9vTfpp5akPyI90iM90m+B9OvK7mNm9K3or98d+IEf+PXXfPHi
//p6CGbsee/1fqgQd0MQZ03TUV0vw+OE/n8ushr7sG6ZEe6Xdbnb8ozfQm/aEl6e3DIj3SI/3+qvPDcX65
//36Ym/VXngR/4gV8D/Rcvfgpf6NbsUXUe0MUY0AG9bu98H5ync/n1kHdrDczDPMxrnB8C81MzzKvLwzzM
//w7yu+UFz+VboV5cHfuAH/j3m9xf7rr3Rf5f8g1SrB3kxBnmQr9AsP2Z23wr8snvgB37gNwPqixc/BWqK
//hP9JJg/oYgzogF7A7Jk0vw/O07n8SdcNzIsxzMN80V02MxuyfTA/NcO8rhuYh3mY3+gNN2VdNyPl8q3Q
//79Yb9Ed/9N9tcX7mNoQ+/D+0JL08H+mRHuk3WrUvu/VmpDy/If3NnkJ/9Ef/zeb5OWNHxizlN6W/eVTo
//j/7o//XSv9LIqSj2l06dqkl+ffegD/qgv8f+nZkjV32S/vThKr34IC/GIA/y+d07wyE+51St7h30F2P0
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
