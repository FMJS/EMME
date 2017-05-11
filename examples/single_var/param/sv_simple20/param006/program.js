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
outputs[1] = "id8_R_t3: 2;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 514;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 131074;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 131586;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 258;id9_R_t3: 0";
outputs[10] = "id8_R_t3: 131328;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 131330;id9_R_t3: 0";
outputs[12] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[13] = "id8_R_t3: 65538;id9_R_t3: 0";
outputs[14] = "id8_R_t3: 66048;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 66050;id9_R_t3: 0";
outputs[16] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[17] = "id8_R_t3: 65794;id9_R_t3: 0";
outputs[18] = "id8_R_t3: 16777216;id9_R_t3: 0";
outputs[19] = "id8_R_t3: 16777218;id9_R_t3: 0";
outputs[20] = "id8_R_t3: 16777728;id9_R_t3: 0";
outputs[21] = "id8_R_t3: 16777730;id9_R_t3: 0";
outputs[22] = "id8_R_t3: 16908288;id9_R_t3: 0";
outputs[23] = "id8_R_t3: 16908290;id9_R_t3: 0";
outputs[24] = "id8_R_t3: 16908800;id9_R_t3: 0";
outputs[25] = "id8_R_t3: 16908802;id9_R_t3: 0";
outputs[26] = "id8_R_t3: 16777472;id9_R_t3: 0";
outputs[27] = "id8_R_t3: 16777474;id9_R_t3: 0";
outputs[28] = "id8_R_t3: 16908544;id9_R_t3: 0";
outputs[29] = "id8_R_t3: 16908546;id9_R_t3: 0";
outputs[30] = "id8_R_t3: 16842752;id9_R_t3: 0";
outputs[31] = "id8_R_t3: 16842754;id9_R_t3: 0";
outputs[32] = "id8_R_t3: 16843264;id9_R_t3: 0";
outputs[33] = "id8_R_t3: 16843266;id9_R_t3: 0";
outputs[34] = "id8_R_t3: 16843008;id9_R_t3: 0";
outputs[35] = "id8_R_t3: 16843010;id9_R_t3: 0";
outputs[36] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[37] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[38] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[39] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[40] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[41] = "id8_R_t3: 131074;id9_R_t3: 2";
outputs[42] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[43] = "id8_R_t3: 131586;id9_R_t3: 2";
outputs[44] = "id8_R_t3: 256;id9_R_t3: 2";
outputs[45] = "id8_R_t3: 258;id9_R_t3: 2";
outputs[46] = "id8_R_t3: 131328;id9_R_t3: 2";
outputs[47] = "id8_R_t3: 131330;id9_R_t3: 2";
outputs[48] = "id8_R_t3: 65536;id9_R_t3: 2";
outputs[49] = "id8_R_t3: 65538;id9_R_t3: 2";
outputs[50] = "id8_R_t3: 66048;id9_R_t3: 2";
outputs[51] = "id8_R_t3: 66050;id9_R_t3: 2";
outputs[52] = "id8_R_t3: 65792;id9_R_t3: 2";
outputs[53] = "id8_R_t3: 65794;id9_R_t3: 2";
outputs[54] = "id8_R_t3: 16777216;id9_R_t3: 2";
outputs[55] = "id8_R_t3: 16777218;id9_R_t3: 2";
outputs[56] = "id8_R_t3: 16777728;id9_R_t3: 2";
outputs[57] = "id8_R_t3: 16777730;id9_R_t3: 2";
outputs[58] = "id8_R_t3: 16908288;id9_R_t3: 2";
outputs[59] = "id8_R_t3: 16908290;id9_R_t3: 2";
outputs[60] = "id8_R_t3: 16908800;id9_R_t3: 2";
outputs[61] = "id8_R_t3: 16908802;id9_R_t3: 2";
outputs[62] = "id8_R_t3: 16777472;id9_R_t3: 2";
outputs[63] = "id8_R_t3: 16777474;id9_R_t3: 2";
outputs[64] = "id8_R_t3: 16908544;id9_R_t3: 2";
outputs[65] = "id8_R_t3: 16908546;id9_R_t3: 2";
outputs[66] = "id8_R_t3: 16842752;id9_R_t3: 2";
outputs[67] = "id8_R_t3: 16842754;id9_R_t3: 2";
outputs[68] = "id8_R_t3: 16843264;id9_R_t3: 2";
outputs[69] = "id8_R_t3: 16843266;id9_R_t3: 2";
outputs[70] = "id8_R_t3: 16843008;id9_R_t3: 2";
outputs[71] = "id8_R_t3: 16843010;id9_R_t3: 2";
outputs[72] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[73] = "id8_R_t3: 2;id9_R_t3: 1";
outputs[74] = "id8_R_t3: 512;id9_R_t3: 1";
outputs[75] = "id8_R_t3: 514;id9_R_t3: 1";
outputs[76] = "id8_R_t3: 131072;id9_R_t3: 1";
outputs[77] = "id8_R_t3: 131074;id9_R_t3: 1";
outputs[78] = "id8_R_t3: 131584;id9_R_t3: 1";
outputs[79] = "id8_R_t3: 131586;id9_R_t3: 1";
outputs[80] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[81] = "id8_R_t3: 258;id9_R_t3: 1";
outputs[82] = "id8_R_t3: 131328;id9_R_t3: 1";
outputs[83] = "id8_R_t3: 131330;id9_R_t3: 1";
outputs[84] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[85] = "id8_R_t3: 65538;id9_R_t3: 1";
outputs[86] = "id8_R_t3: 66048;id9_R_t3: 1";
outputs[87] = "id8_R_t3: 66050;id9_R_t3: 1";
outputs[88] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[89] = "id8_R_t3: 65794;id9_R_t3: 1";
outputs[90] = "id8_R_t3: 16777216;id9_R_t3: 1";
outputs[91] = "id8_R_t3: 16777218;id9_R_t3: 1";
outputs[92] = "id8_R_t3: 16777728;id9_R_t3: 1";
outputs[93] = "id8_R_t3: 16777730;id9_R_t3: 1";
outputs[94] = "id8_R_t3: 16908288;id9_R_t3: 1";
outputs[95] = "id8_R_t3: 16908290;id9_R_t3: 1";
outputs[96] = "id8_R_t3: 16908800;id9_R_t3: 1";
outputs[97] = "id8_R_t3: 16908802;id9_R_t3: 1";
outputs[98] = "id8_R_t3: 16777472;id9_R_t3: 1";
outputs[99] = "id8_R_t3: 16777474;id9_R_t3: 1";
outputs[100] = "id8_R_t3: 16908544;id9_R_t3: 1";
outputs[101] = "id8_R_t3: 16908546;id9_R_t3: 1";
outputs[102] = "id8_R_t3: 16842752;id9_R_t3: 1";
outputs[103] = "id8_R_t3: 16842754;id9_R_t3: 1";
outputs[104] = "id8_R_t3: 16843264;id9_R_t3: 1";
outputs[105] = "id8_R_t3: 16843266;id9_R_t3: 1";
outputs[106] = "id8_R_t3: 16843008;id9_R_t3: 1";
outputs[107] = "id8_R_t3: 16843010;id9_R_t3: 1";
outputs[108] = "id8_R_t3: 0;id9_R_t3: 256";
outputs[109] = "id8_R_t3: 2;id9_R_t3: 256";
outputs[110] = "id8_R_t3: 512;id9_R_t3: 256";
outputs[111] = "id8_R_t3: 514;id9_R_t3: 256";
outputs[112] = "id8_R_t3: 131072;id9_R_t3: 256";
outputs[113] = "id8_R_t3: 131074;id9_R_t3: 256";
outputs[114] = "id8_R_t3: 131584;id9_R_t3: 256";
outputs[115] = "id8_R_t3: 131586;id9_R_t3: 256";
outputs[116] = "id8_R_t3: 256;id9_R_t3: 256";
outputs[117] = "id8_R_t3: 258;id9_R_t3: 256";
outputs[118] = "id8_R_t3: 131328;id9_R_t3: 256";
outputs[119] = "id8_R_t3: 131330;id9_R_t3: 256";
outputs[120] = "id8_R_t3: 65536;id9_R_t3: 256";
outputs[121] = "id8_R_t3: 65538;id9_R_t3: 256";
outputs[122] = "id8_R_t3: 66048;id9_R_t3: 256";
outputs[123] = "id8_R_t3: 66050;id9_R_t3: 256";
outputs[124] = "id8_R_t3: 65792;id9_R_t3: 256";
outputs[125] = "id8_R_t3: 65794;id9_R_t3: 256";
outputs[126] = "id8_R_t3: 16777216;id9_R_t3: 256";
outputs[127] = "id8_R_t3: 16777218;id9_R_t3: 256";
outputs[128] = "id8_R_t3: 16777728;id9_R_t3: 256";
outputs[129] = "id8_R_t3: 16777730;id9_R_t3: 256";
outputs[130] = "id8_R_t3: 16908288;id9_R_t3: 256";
outputs[131] = "id8_R_t3: 16908290;id9_R_t3: 256";
outputs[132] = "id8_R_t3: 16908800;id9_R_t3: 256";
outputs[133] = "id8_R_t3: 16908802;id9_R_t3: 256";
outputs[134] = "id8_R_t3: 16777472;id9_R_t3: 256";
outputs[135] = "id8_R_t3: 16777474;id9_R_t3: 256";
outputs[136] = "id8_R_t3: 16908544;id9_R_t3: 256";
outputs[137] = "id8_R_t3: 16908546;id9_R_t3: 256";
outputs[138] = "id8_R_t3: 16842752;id9_R_t3: 256";
outputs[139] = "id8_R_t3: 16842754;id9_R_t3: 256";
outputs[140] = "id8_R_t3: 16843264;id9_R_t3: 256";
outputs[141] = "id8_R_t3: 16843266;id9_R_t3: 256";
outputs[142] = "id8_R_t3: 16843008;id9_R_t3: 256";
outputs[143] = "id8_R_t3: 16843010;id9_R_t3: 256";
outputs[144] = "id8_R_t3: 0;id9_R_t3: 258";
outputs[145] = "id8_R_t3: 2;id9_R_t3: 258";
outputs[146] = "id8_R_t3: 512;id9_R_t3: 258";
outputs[147] = "id8_R_t3: 514;id9_R_t3: 258";
outputs[148] = "id8_R_t3: 131072;id9_R_t3: 258";
outputs[149] = "id8_R_t3: 131074;id9_R_t3: 258";
outputs[150] = "id8_R_t3: 131584;id9_R_t3: 258";
outputs[151] = "id8_R_t3: 131586;id9_R_t3: 258";
outputs[152] = "id8_R_t3: 256;id9_R_t3: 258";
outputs[153] = "id8_R_t3: 258;id9_R_t3: 258";
outputs[154] = "id8_R_t3: 131328;id9_R_t3: 258";
outputs[155] = "id8_R_t3: 131330;id9_R_t3: 258";
outputs[156] = "id8_R_t3: 65536;id9_R_t3: 258";
outputs[157] = "id8_R_t3: 65538;id9_R_t3: 258";
outputs[158] = "id8_R_t3: 66048;id9_R_t3: 258";
outputs[159] = "id8_R_t3: 66050;id9_R_t3: 258";
outputs[160] = "id8_R_t3: 65792;id9_R_t3: 258";
outputs[161] = "id8_R_t3: 65794;id9_R_t3: 258";
outputs[162] = "id8_R_t3: 16777216;id9_R_t3: 258";
outputs[163] = "id8_R_t3: 16777218;id9_R_t3: 258";
outputs[164] = "id8_R_t3: 16777728;id9_R_t3: 258";
outputs[165] = "id8_R_t3: 16777730;id9_R_t3: 258";
outputs[166] = "id8_R_t3: 16908288;id9_R_t3: 258";
outputs[167] = "id8_R_t3: 16908290;id9_R_t3: 258";
outputs[168] = "id8_R_t3: 16908800;id9_R_t3: 258";
outputs[169] = "id8_R_t3: 16908802;id9_R_t3: 258";
outputs[170] = "id8_R_t3: 16777472;id9_R_t3: 258";
outputs[171] = "id8_R_t3: 16777474;id9_R_t3: 258";
outputs[172] = "id8_R_t3: 16908544;id9_R_t3: 258";
outputs[173] = "id8_R_t3: 16908546;id9_R_t3: 258";
outputs[174] = "id8_R_t3: 16842752;id9_R_t3: 258";
outputs[175] = "id8_R_t3: 16842754;id9_R_t3: 258";
outputs[176] = "id8_R_t3: 16843264;id9_R_t3: 258";
outputs[177] = "id8_R_t3: 16843266;id9_R_t3: 258";
outputs[178] = "id8_R_t3: 16843008;id9_R_t3: 258";
outputs[179] = "id8_R_t3: 16843010;id9_R_t3: 258";
outputs[180] = "id8_R_t3: 0;id9_R_t3: 257";
outputs[181] = "id8_R_t3: 2;id9_R_t3: 257";
outputs[182] = "id8_R_t3: 512;id9_R_t3: 257";
outputs[183] = "id8_R_t3: 514;id9_R_t3: 257";
outputs[184] = "id8_R_t3: 131072;id9_R_t3: 257";
outputs[185] = "id8_R_t3: 131074;id9_R_t3: 257";
outputs[186] = "id8_R_t3: 131584;id9_R_t3: 257";
outputs[187] = "id8_R_t3: 131586;id9_R_t3: 257";
outputs[188] = "id8_R_t3: 256;id9_R_t3: 257";
outputs[189] = "id8_R_t3: 258;id9_R_t3: 257";
outputs[190] = "id8_R_t3: 131328;id9_R_t3: 257";
outputs[191] = "id8_R_t3: 131330;id9_R_t3: 257";
outputs[192] = "id8_R_t3: 65536;id9_R_t3: 257";
outputs[193] = "id8_R_t3: 65538;id9_R_t3: 257";
outputs[194] = "id8_R_t3: 66048;id9_R_t3: 257";
outputs[195] = "id8_R_t3: 66050;id9_R_t3: 257";
outputs[196] = "id8_R_t3: 65792;id9_R_t3: 257";
outputs[197] = "id8_R_t3: 65794;id9_R_t3: 257";
outputs[198] = "id8_R_t3: 16777216;id9_R_t3: 257";
outputs[199] = "id8_R_t3: 16777218;id9_R_t3: 257";
outputs[200] = "id8_R_t3: 16777728;id9_R_t3: 257";
outputs[201] = "id8_R_t3: 16777730;id9_R_t3: 257";
outputs[202] = "id8_R_t3: 16908288;id9_R_t3: 257";
outputs[203] = "id8_R_t3: 16908290;id9_R_t3: 257";
outputs[204] = "id8_R_t3: 16908800;id9_R_t3: 257";
outputs[205] = "id8_R_t3: 16908802;id9_R_t3: 257";
outputs[206] = "id8_R_t3: 16777472;id9_R_t3: 257";
outputs[207] = "id8_R_t3: 16777474;id9_R_t3: 257";
outputs[208] = "id8_R_t3: 16908544;id9_R_t3: 257";
outputs[209] = "id8_R_t3: 16908546;id9_R_t3: 257";
outputs[210] = "id8_R_t3: 16842752;id9_R_t3: 257";
outputs[211] = "id8_R_t3: 16842754;id9_R_t3: 257";
outputs[212] = "id8_R_t3: 16843264;id9_R_t3: 257";
outputs[213] = "id8_R_t3: 16843266;id9_R_t3: 257";
outputs[214] = "id8_R_t3: 16843008;id9_R_t3: 257";
outputs[215] = "id8_R_t3: 16843010;id9_R_t3: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
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
//0JpIwQiMwAgXPR+U5oOjG8nOs8H/Aa7CuRM=
