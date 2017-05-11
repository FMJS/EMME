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
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 2;
      var x = new Int8Array(data.x_sab); x[3] = 2;
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
outputs[8] = "id8_R_t3: 33554432;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 33554434;id9_R_t3: 0";
outputs[10] = "id8_R_t3: 33554944;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 33554946;id9_R_t3: 0";
outputs[12] = "id8_R_t3: 33685504;id9_R_t3: 0";
outputs[13] = "id8_R_t3: 33685506;id9_R_t3: 0";
outputs[14] = "id8_R_t3: 33686016;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 33686018;id9_R_t3: 0";
outputs[16] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[17] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[18] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[19] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[20] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[21] = "id8_R_t3: 131074;id9_R_t3: 2";
outputs[22] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[23] = "id8_R_t3: 131586;id9_R_t3: 2";
outputs[24] = "id8_R_t3: 33554432;id9_R_t3: 2";
outputs[25] = "id8_R_t3: 33554434;id9_R_t3: 2";
outputs[26] = "id8_R_t3: 33554944;id9_R_t3: 2";
outputs[27] = "id8_R_t3: 33554946;id9_R_t3: 2";
outputs[28] = "id8_R_t3: 33685504;id9_R_t3: 2";
outputs[29] = "id8_R_t3: 33685506;id9_R_t3: 2";
outputs[30] = "id8_R_t3: 33686016;id9_R_t3: 2";
outputs[31] = "id8_R_t3: 33686018;id9_R_t3: 2";
outputs[32] = "id8_R_t3: 0;id9_R_t3: 512";
outputs[33] = "id8_R_t3: 2;id9_R_t3: 512";
outputs[34] = "id8_R_t3: 512;id9_R_t3: 512";
outputs[35] = "id8_R_t3: 514;id9_R_t3: 512";
outputs[36] = "id8_R_t3: 131072;id9_R_t3: 512";
outputs[37] = "id8_R_t3: 131074;id9_R_t3: 512";
outputs[38] = "id8_R_t3: 131584;id9_R_t3: 512";
outputs[39] = "id8_R_t3: 131586;id9_R_t3: 512";
outputs[40] = "id8_R_t3: 33554432;id9_R_t3: 512";
outputs[41] = "id8_R_t3: 33554434;id9_R_t3: 512";
outputs[42] = "id8_R_t3: 33554944;id9_R_t3: 512";
outputs[43] = "id8_R_t3: 33554946;id9_R_t3: 512";
outputs[44] = "id8_R_t3: 33685504;id9_R_t3: 512";
outputs[45] = "id8_R_t3: 33685506;id9_R_t3: 512";
outputs[46] = "id8_R_t3: 33686016;id9_R_t3: 512";
outputs[47] = "id8_R_t3: 33686018;id9_R_t3: 512";
outputs[48] = "id8_R_t3: 0;id9_R_t3: 514";
outputs[49] = "id8_R_t3: 2;id9_R_t3: 514";
outputs[50] = "id8_R_t3: 512;id9_R_t3: 514";
outputs[51] = "id8_R_t3: 514;id9_R_t3: 514";
outputs[52] = "id8_R_t3: 131072;id9_R_t3: 514";
outputs[53] = "id8_R_t3: 131074;id9_R_t3: 514";
outputs[54] = "id8_R_t3: 131584;id9_R_t3: 514";
outputs[55] = "id8_R_t3: 131586;id9_R_t3: 514";
outputs[56] = "id8_R_t3: 33554432;id9_R_t3: 514";
outputs[57] = "id8_R_t3: 33554434;id9_R_t3: 514";
outputs[58] = "id8_R_t3: 33554944;id9_R_t3: 514";
outputs[59] = "id8_R_t3: 33554946;id9_R_t3: 514";
outputs[60] = "id8_R_t3: 33685504;id9_R_t3: 514";
outputs[61] = "id8_R_t3: 33685506;id9_R_t3: 514";
outputs[62] = "id8_R_t3: 33686016;id9_R_t3: 514";
outputs[63] = "id8_R_t3: 33686018;id9_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3U2PG8cRgOF7fsUeI8DAktszQzJBDjECI5ckgHPIUQigHATEcQ7yKfB/j2TJMi2OZnaa/aXp57YY
//LsVFafd9u6qrux4fv//hzX9/ePP4+PD61fnlty/fhN89HH7/+tXl568fH7/7/tW//v32G/789cMfHv73
//29evnl7+4+Wb41dv3xF++urFVw+/ejpcPQ2zT8d3Xz+9ezr99NWnT09XT6fZp+9/1ndP3/+k758e337H
//d/98/Z93z5+uPu/6efjM8+Ezz8erT71+Pn3m+ekzz8+f+Tk//Pw/Pvzxr396+MvfxDhfjD+J4fWn/vJ0
//mn16mn16nv13rz8tzH5amP20MPtpYfbTwuynDbOfNsx+2jD7acPspw2zn/bL79J59un1906z3zvNfu9p
//9ntPn37v+7+Yb7/+5qc/mV/9vv78f//2nYd37/7ci8elF5+WXgwfXrwsvfMy/84PP/g3H/7UZ//9+Xe/
//f+ff//HunT/+5nEO3k/gDd7gDd57gPf9fP7lxY+/7of86J751Gigj0dIh3RIh/T9r8c3Iv3jr/WxJNJD
//AqQPkA7pkA7pe0D6vQvx2kC//hNLifljOB5OFu9Ij/RI33kx/VYDH399n0qyfkhDdet3VEd1VN9/lX3T
//+r0O0+fX70lIP56RHumRHun3v35/Rn29NulDTtJPSI/0SI/0eyD9fWX3Nlf0ueivwwb6oR/6ddjcvPgx
//qEU3ZK//K3XYQLoYQ7oOmyRL/TpAn1/P3495FXqkR3qk77ZCf1OeqU36ISfpVeiRHumRvr8KfXOcX++5
//SUx/nfToj/7or5P+5sWP4Su6RzulobrqDaqjOqrrpG+A6fOr+kmdHunFGOmRPkMnfR3Sh5ykV6dHeqRH
//ep30ja7og3U++osx+qN/2nX+zWZsbf6Ps3+Q1vlIL8ZIj/Sp2ujbXOfnon8I4zgMQUcO/uM//hsU9cmL
//HwMVSjrglIrrKji4juu43uMMqYVFfx2qz6/sE7H+MmA91mM91vd49c3Cbm0d1oe8rFevx3qsx/qd3okT
//15fT0qo+H/+n8zgerPXxH//xv8d6/cINCnUMMORlvbU+1mM91u+0hh93V05La/2c/J8OR/zHf/zH/52u
//9beMLGmzqp+Z/2f8x3/8x/8vlv+JBlaVon/szCo9PdgvxtiP/Ul6ehZOZtVZ/c+fwdLTg/VijPVYH93T
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
//iWTpbPB/WIm8qQ==
