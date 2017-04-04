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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id8_R_t3 = Atomics.load(x, 0); report.push("id8_R_t3: "+id8_R_t3);
      var x = new Int16Array(data.x_sab); id9_R_t3 = Atomics.load(x, 1); report.push("id9_R_t3: "+id9_R_t3);
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
outputs[0] = "id8_R_t3: 16843264;id9_R_t3: 2";
outputs[1] = "id8_R_t3: 16843264;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 16843264;id9_R_t3: 1";
outputs[3] = "id8_R_t3: 2;id9_R_t3: 1";
outputs[4] = "id8_R_t3: 2;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 16777216;id9_R_t3: 1";
outputs[6] = "id8_R_t3: 16777216;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 16777218;id9_R_t3: 1";
outputs[8] = "id8_R_t3: 16777218;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 16777218;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 16842752;id9_R_t3: 258";
outputs[11] = "id8_R_t3: 16908544;id9_R_t3: 256";
outputs[12] = "id8_R_t3: 16908544;id9_R_t3: 257";
outputs[13] = "id8_R_t3: 256;id9_R_t3: 2";
outputs[14] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[16] = "id8_R_t3: 258;id9_R_t3: 257";
outputs[17] = "id8_R_t3: 258;id9_R_t3: 256";
outputs[18] = "id8_R_t3: 131584;id9_R_t3: 258";
outputs[19] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[20] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[21] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[22] = "id8_R_t3: 16777216;id9_R_t3: 2";
outputs[23] = "id8_R_t3: 16777474;id9_R_t3: 1";
outputs[24] = "id8_R_t3: 16842754;id9_R_t3: 0";
outputs[25] = "id8_R_t3: 16777474;id9_R_t3: 2";
outputs[26] = "id8_R_t3: 65536;id9_R_t3: 257";
outputs[27] = "id8_R_t3: 2;id9_R_t3: 2";
outputs[28] = "id8_R_t3: 65536;id9_R_t3: 256";
outputs[29] = "id8_R_t3: 66048;id9_R_t3: 256";
outputs[30] = "id8_R_t3: 66048;id9_R_t3: 257";
outputs[31] = "id8_R_t3: 16908290;id9_R_t3: 256";
outputs[32] = "id8_R_t3: 16908290;id9_R_t3: 257";
outputs[33] = "id8_R_t3: 16777472;id9_R_t3: 256";
outputs[34] = "id8_R_t3: 16777472;id9_R_t3: 257";
outputs[35] = "id8_R_t3: 66048;id9_R_t3: 258";
outputs[36] = "id8_R_t3: 131074;id9_R_t3: 2";
outputs[37] = "id8_R_t3: 131074;id9_R_t3: 0";
outputs[38] = "id8_R_t3: 131074;id9_R_t3: 1";
outputs[39] = "id8_R_t3: 16777218;id9_R_t3: 258";
outputs[40] = "id8_R_t3: 16777218;id9_R_t3: 256";
outputs[41] = "id8_R_t3: 16777218;id9_R_t3: 257";
outputs[42] = "id8_R_t3: 256;id9_R_t3: 258";
outputs[43] = "id8_R_t3: 131074;id9_R_t3: 258";
outputs[44] = "id8_R_t3: 258;id9_R_t3: 0";
outputs[45] = "id8_R_t3: 258;id9_R_t3: 1";
outputs[46] = "id8_R_t3: 258;id9_R_t3: 2";
outputs[47] = "id8_R_t3: 256;id9_R_t3: 256";
outputs[48] = "id8_R_t3: 16908544;id9_R_t3: 1";
outputs[49] = "id8_R_t3: 16908544;id9_R_t3: 0";
outputs[50] = "id8_R_t3: 16908544;id9_R_t3: 2";
outputs[51] = "id8_R_t3: 16843008;id9_R_t3: 258";
outputs[52] = "id8_R_t3: 16842754;id9_R_t3: 258";
outputs[53] = "id8_R_t3: 16777474;id9_R_t3: 258";
outputs[54] = "id8_R_t3: 514;id9_R_t3: 258";
outputs[55] = "id8_R_t3: 16908290;id9_R_t3: 258";
outputs[56] = "id8_R_t3: 16777216;id9_R_t3: 258";
outputs[57] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[58] = "id8_R_t3: 16777216;id9_R_t3: 256";
outputs[59] = "id8_R_t3: 16777216;id9_R_t3: 257";
outputs[60] = "id8_R_t3: 514;id9_R_t3: 256";
outputs[61] = "id8_R_t3: 514;id9_R_t3: 257";
outputs[62] = "id8_R_t3: 65536;id9_R_t3: 2";
outputs[63] = "id8_R_t3: 512;id9_R_t3: 1";
outputs[64] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[65] = "id8_R_t3: 131074;id9_R_t3: 257";
outputs[66] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[67] = "id8_R_t3: 16777728;id9_R_t3: 256";
outputs[68] = "id8_R_t3: 16777728;id9_R_t3: 257";
outputs[69] = "id8_R_t3: 66050;id9_R_t3: 0";
outputs[70] = "id8_R_t3: 66050;id9_R_t3: 1";
outputs[71] = "id8_R_t3: 66050;id9_R_t3: 2";
outputs[72] = "id8_R_t3: 131586;id9_R_t3: 0";
outputs[73] = "id8_R_t3: 131586;id9_R_t3: 1";
outputs[74] = "id8_R_t3: 131586;id9_R_t3: 2";
outputs[75] = "id8_R_t3: 16842752;id9_R_t3: 2";
outputs[76] = "id8_R_t3: 16843008;id9_R_t3: 257";
outputs[77] = "id8_R_t3: 16842752;id9_R_t3: 1";
outputs[78] = "id8_R_t3: 16908800;id9_R_t3: 0";
outputs[79] = "id8_R_t3: 131328;id9_R_t3: 257";
outputs[80] = "id8_R_t3: 16777472;id9_R_t3: 0";
outputs[81] = "id8_R_t3: 131072;id9_R_t3: 1";
outputs[82] = "id8_R_t3: 65538;id9_R_t3: 257";
outputs[83] = "id8_R_t3: 65792;id9_R_t3: 258";
outputs[84] = "id8_R_t3: 16908800;id9_R_t3: 2";
outputs[85] = "id8_R_t3: 16908800;id9_R_t3: 256";
outputs[86] = "id8_R_t3: 16843266;id9_R_t3: 0";
outputs[87] = "id8_R_t3: 16843266;id9_R_t3: 1";
outputs[88] = "id8_R_t3: 16843266;id9_R_t3: 2";
outputs[89] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[90] = "id8_R_t3: 16777730;id9_R_t3: 2";
outputs[91] = "id8_R_t3: 16777730;id9_R_t3: 0";
outputs[92] = "id8_R_t3: 16777730;id9_R_t3: 1";
outputs[93] = "id8_R_t3: 16843008;id9_R_t3: 256";
outputs[94] = "id8_R_t3: 16842754;id9_R_t3: 1";
outputs[95] = "id8_R_t3: 16842752;id9_R_t3: 256";
outputs[96] = "id8_R_t3: 16777474;id9_R_t3: 0";
outputs[97] = "id8_R_t3: 16908800;id9_R_t3: 257";
outputs[98] = "id8_R_t3: 16843010;id9_R_t3: 1";
outputs[99] = "id8_R_t3: 16843008;id9_R_t3: 2";
outputs[100] = "id8_R_t3: 16843010;id9_R_t3: 0";
outputs[101] = "id8_R_t3: 16843008;id9_R_t3: 0";
outputs[102] = "id8_R_t3: 16843010;id9_R_t3: 2";
outputs[103] = "id8_R_t3: 65538;id9_R_t3: 256";
outputs[104] = "id8_R_t3: 16842754;id9_R_t3: 2";
outputs[105] = "id8_R_t3: 65794;id9_R_t3: 257";
outputs[106] = "id8_R_t3: 65794;id9_R_t3: 256";
outputs[107] = "id8_R_t3: 131328;id9_R_t3: 256";
outputs[108] = "id8_R_t3: 65794;id9_R_t3: 258";
outputs[109] = "id8_R_t3: 16843008;id9_R_t3: 1";
outputs[110] = "id8_R_t3: 16843266;id9_R_t3: 257";
outputs[111] = "id8_R_t3: 16843266;id9_R_t3: 256";
outputs[112] = "id8_R_t3: 0;id9_R_t3: 258";
outputs[113] = "id8_R_t3: 16842754;id9_R_t3: 256";
outputs[114] = "id8_R_t3: 512;id9_R_t3: 256";
outputs[115] = "id8_R_t3: 512;id9_R_t3: 257";
outputs[116] = "id8_R_t3: 16842754;id9_R_t3: 257";
outputs[117] = "id8_R_t3: 65792;id9_R_t3: 257";
outputs[118] = "id8_R_t3: 512;id9_R_t3: 258";
outputs[119] = "id8_R_t3: 0;id9_R_t3: 256";
outputs[120] = "id8_R_t3: 131584;id9_R_t3: 256";
outputs[121] = "id8_R_t3: 131072;id9_R_t3: 257";
outputs[122] = "id8_R_t3: 131072;id9_R_t3: 256";
outputs[123] = "id8_R_t3: 16843266;id9_R_t3: 258";
outputs[124] = "id8_R_t3: 256;id9_R_t3: 257";
outputs[125] = "id8_R_t3: 16908544;id9_R_t3: 258";
outputs[126] = "id8_R_t3: 131586;id9_R_t3: 258";
outputs[127] = "id8_R_t3: 131072;id9_R_t3: 258";
outputs[128] = "id8_R_t3: 16843010;id9_R_t3: 256";
outputs[129] = "id8_R_t3: 16843010;id9_R_t3: 257";
outputs[130] = "id8_R_t3: 16843010;id9_R_t3: 258";
outputs[131] = "id8_R_t3: 16908546;id9_R_t3: 258";
outputs[132] = "id8_R_t3: 65538;id9_R_t3: 258";
outputs[133] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[134] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[135] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[136] = "id8_R_t3: 131584;id9_R_t3: 1";
outputs[137] = "id8_R_t3: 131330;id9_R_t3: 257";
outputs[138] = "id8_R_t3: 16908288;id9_R_t3: 2";
outputs[139] = "id8_R_t3: 16908800;id9_R_t3: 1";
outputs[140] = "id8_R_t3: 16908288;id9_R_t3: 0";
outputs[141] = "id8_R_t3: 16908288;id9_R_t3: 1";
outputs[142] = "id8_R_t3: 16908546;id9_R_t3: 256";
outputs[143] = "id8_R_t3: 131584;id9_R_t3: 257";
outputs[144] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[145] = "id8_R_t3: 514;id9_R_t3: 2";
outputs[146] = "id8_R_t3: 514;id9_R_t3: 1";
outputs[147] = "id8_R_t3: 514;id9_R_t3: 0";
outputs[148] = "id8_R_t3: 16777472;id9_R_t3: 258";
outputs[149] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[150] = "id8_R_t3: 16908546;id9_R_t3: 257";
outputs[151] = "id8_R_t3: 131074;id9_R_t3: 256";
outputs[152] = "id8_R_t3: 65792;id9_R_t3: 2";
outputs[153] = "id8_R_t3: 16908802;id9_R_t3: 257";
outputs[154] = "id8_R_t3: 16908802;id9_R_t3: 256";
outputs[155] = "id8_R_t3: 66050;id9_R_t3: 257";
outputs[156] = "id8_R_t3: 66050;id9_R_t3: 256";
outputs[157] = "id8_R_t3: 66048;id9_R_t3: 1";
outputs[158] = "id8_R_t3: 65536;id9_R_t3: 258";
outputs[159] = "id8_R_t3: 65538;id9_R_t3: 2";
outputs[160] = "id8_R_t3: 66048;id9_R_t3: 2";
outputs[161] = "id8_R_t3: 65538;id9_R_t3: 0";
outputs[162] = "id8_R_t3: 65538;id9_R_t3: 1";
outputs[163] = "id8_R_t3: 16908290;id9_R_t3: 1";
outputs[164] = "id8_R_t3: 16908290;id9_R_t3: 0";
outputs[165] = "id8_R_t3: 16908290;id9_R_t3: 2";
outputs[166] = "id8_R_t3: 2;id9_R_t3: 256";
outputs[167] = "id8_R_t3: 2;id9_R_t3: 257";
outputs[168] = "id8_R_t3: 16842752;id9_R_t3: 257";
outputs[169] = "id8_R_t3: 16908802;id9_R_t3: 2";
outputs[170] = "id8_R_t3: 16908802;id9_R_t3: 0";
outputs[171] = "id8_R_t3: 16908802;id9_R_t3: 1";
outputs[172] = "id8_R_t3: 66048;id9_R_t3: 0";
outputs[173] = "id8_R_t3: 16908546;id9_R_t3: 1";
outputs[174] = "id8_R_t3: 2;id9_R_t3: 258";
outputs[175] = "id8_R_t3: 131586;id9_R_t3: 257";
outputs[176] = "id8_R_t3: 131586;id9_R_t3: 256";
outputs[177] = "id8_R_t3: 65794;id9_R_t3: 1";
outputs[178] = "id8_R_t3: 16777728;id9_R_t3: 1";
outputs[179] = "id8_R_t3: 16777728;id9_R_t3: 0";
outputs[180] = "id8_R_t3: 16777728;id9_R_t3: 2";
outputs[181] = "id8_R_t3: 131330;id9_R_t3: 1";
outputs[182] = "id8_R_t3: 131330;id9_R_t3: 0";
outputs[183] = "id8_R_t3: 131330;id9_R_t3: 2";
outputs[184] = "id8_R_t3: 0;id9_R_t3: 257";
outputs[185] = "id8_R_t3: 65794;id9_R_t3: 2";
outputs[186] = "id8_R_t3: 16908546;id9_R_t3: 2";
outputs[187] = "id8_R_t3: 65794;id9_R_t3: 0";
outputs[188] = "id8_R_t3: 16908546;id9_R_t3: 0";
outputs[189] = "id8_R_t3: 16843264;id9_R_t3: 258";
outputs[190] = "id8_R_t3: 16843264;id9_R_t3: 257";
outputs[191] = "id8_R_t3: 16843264;id9_R_t3: 256";
outputs[192] = "id8_R_t3: 16777728;id9_R_t3: 258";
outputs[193] = "id8_R_t3: 65792;id9_R_t3: 256";
outputs[194] = "id8_R_t3: 16777730;id9_R_t3: 258";
outputs[195] = "id8_R_t3: 66050;id9_R_t3: 258";
outputs[196] = "id8_R_t3: 16777730;id9_R_t3: 257";
outputs[197] = "id8_R_t3: 16777730;id9_R_t3: 256";
outputs[198] = "id8_R_t3: 16908802;id9_R_t3: 258";
outputs[199] = "id8_R_t3: 258;id9_R_t3: 258";
outputs[200] = "id8_R_t3: 16908288;id9_R_t3: 258";
outputs[201] = "id8_R_t3: 131330;id9_R_t3: 256";
outputs[202] = "id8_R_t3: 16777472;id9_R_t3: 2";
outputs[203] = "id8_R_t3: 16777472;id9_R_t3: 1";
outputs[204] = "id8_R_t3: 16842752;id9_R_t3: 0";
outputs[205] = "id8_R_t3: 131330;id9_R_t3: 258";
outputs[206] = "id8_R_t3: 16908288;id9_R_t3: 257";
outputs[207] = "id8_R_t3: 16908288;id9_R_t3: 256";
outputs[208] = "id8_R_t3: 16777474;id9_R_t3: 256";
outputs[209] = "id8_R_t3: 16777474;id9_R_t3: 257";
outputs[210] = "id8_R_t3: 16908800;id9_R_t3: 258";
outputs[211] = "id8_R_t3: 131328;id9_R_t3: 258";
outputs[212] = "id8_R_t3: 131328;id9_R_t3: 2";
outputs[213] = "id8_R_t3: 131328;id9_R_t3: 0";
outputs[214] = "id8_R_t3: 131328;id9_R_t3: 1";
outputs[215] = "id8_R_t3: 0;id9_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected outputs //
//output// id8_R_t3: 16843264;id9_R_t3: 2
//output// id8_R_t3: 16843264;id9_R_t3: 0
//output// id8_R_t3: 16843264;id9_R_t3: 1
//output// id8_R_t3: 2;id9_R_t3: 1
//output// id8_R_t3: 2;id9_R_t3: 0
//output// id8_R_t3: 16777216;id9_R_t3: 1
//output// id8_R_t3: 16777216;id9_R_t3: 0
//output// id8_R_t3: 16777218;id9_R_t3: 1
//output// id8_R_t3: 16777218;id9_R_t3: 0
//output// id8_R_t3: 16777218;id9_R_t3: 2
//output// id8_R_t3: 16842752;id9_R_t3: 258
//output// id8_R_t3: 16908544;id9_R_t3: 256
//output// id8_R_t3: 16908544;id9_R_t3: 257
//output// id8_R_t3: 256;id9_R_t3: 2
//output// id8_R_t3: 256;id9_R_t3: 0
//output// id8_R_t3: 256;id9_R_t3: 1
//output// id8_R_t3: 258;id9_R_t3: 257
//output// id8_R_t3: 258;id9_R_t3: 256
//output// id8_R_t3: 131584;id9_R_t3: 258
//output// id8_R_t3: 131072;id9_R_t3: 0
//output// id8_R_t3: 0;id9_R_t3: 2
//output// id8_R_t3: 131072;id9_R_t3: 2
//output// id8_R_t3: 16777216;id9_R_t3: 2
//output// id8_R_t3: 16777474;id9_R_t3: 1
//output// id8_R_t3: 16842754;id9_R_t3: 0
//output// id8_R_t3: 16777474;id9_R_t3: 2
//output// id8_R_t3: 65536;id9_R_t3: 257
//output// id8_R_t3: 2;id9_R_t3: 2
//output// id8_R_t3: 65536;id9_R_t3: 256
//output// id8_R_t3: 66048;id9_R_t3: 256
//output// id8_R_t3: 66048;id9_R_t3: 257
//output// id8_R_t3: 16908290;id9_R_t3: 256
//output// id8_R_t3: 16908290;id9_R_t3: 257
//output// id8_R_t3: 16777472;id9_R_t3: 256
//output// id8_R_t3: 16777472;id9_R_t3: 257
//output// id8_R_t3: 66048;id9_R_t3: 258
//output// id8_R_t3: 131074;id9_R_t3: 2
//output// id8_R_t3: 131074;id9_R_t3: 0
//output// id8_R_t3: 131074;id9_R_t3: 1
//output// id8_R_t3: 16777218;id9_R_t3: 258
//output// id8_R_t3: 16777218;id9_R_t3: 256
//output// id8_R_t3: 16777218;id9_R_t3: 257
//output// id8_R_t3: 256;id9_R_t3: 258
//output// id8_R_t3: 131074;id9_R_t3: 258
//output// id8_R_t3: 258;id9_R_t3: 0
//output// id8_R_t3: 258;id9_R_t3: 1
//output// id8_R_t3: 258;id9_R_t3: 2
//output// id8_R_t3: 256;id9_R_t3: 256
//output// id8_R_t3: 16908544;id9_R_t3: 1
//output// id8_R_t3: 16908544;id9_R_t3: 0
//output// id8_R_t3: 16908544;id9_R_t3: 2
//output// id8_R_t3: 16843008;id9_R_t3: 258
//output// id8_R_t3: 16842754;id9_R_t3: 258
//output// id8_R_t3: 16777474;id9_R_t3: 258
//output// id8_R_t3: 514;id9_R_t3: 258
//output// id8_R_t3: 16908290;id9_R_t3: 258
//output// id8_R_t3: 16777216;id9_R_t3: 258
//output// id8_R_t3: 131584;id9_R_t3: 2
//output// id8_R_t3: 16777216;id9_R_t3: 256
//output// id8_R_t3: 16777216;id9_R_t3: 257
//output// id8_R_t3: 514;id9_R_t3: 256
//output// id8_R_t3: 514;id9_R_t3: 257
//output// id8_R_t3: 65536;id9_R_t3: 2
//output// id8_R_t3: 512;id9_R_t3: 1
//output// id8_R_t3: 512;id9_R_t3: 0
//output// id8_R_t3: 131074;id9_R_t3: 257
//output// id8_R_t3: 512;id9_R_t3: 2
//output// id8_R_t3: 16777728;id9_R_t3: 256
//output// id8_R_t3: 16777728;id9_R_t3: 257
//output// id8_R_t3: 66050;id9_R_t3: 0
//output// id8_R_t3: 66050;id9_R_t3: 1
//output// id8_R_t3: 66050;id9_R_t3: 2
//output// id8_R_t3: 131586;id9_R_t3: 0
//output// id8_R_t3: 131586;id9_R_t3: 1
//output// id8_R_t3: 131586;id9_R_t3: 2
//output// id8_R_t3: 16842752;id9_R_t3: 2
//output// id8_R_t3: 16843008;id9_R_t3: 257
//output// id8_R_t3: 16842752;id9_R_t3: 1
//output// id8_R_t3: 16908800;id9_R_t3: 0
//output// id8_R_t3: 131328;id9_R_t3: 257
//output// id8_R_t3: 16777472;id9_R_t3: 0
//output// id8_R_t3: 131072;id9_R_t3: 1
//output// id8_R_t3: 65538;id9_R_t3: 257
//output// id8_R_t3: 65792;id9_R_t3: 258
//output// id8_R_t3: 16908800;id9_R_t3: 2
//output// id8_R_t3: 16908800;id9_R_t3: 256
//output// id8_R_t3: 16843266;id9_R_t3: 0
//output// id8_R_t3: 16843266;id9_R_t3: 1
//output// id8_R_t3: 16843266;id9_R_t3: 2
//output// id8_R_t3: 0;id9_R_t3: 0
//output// id8_R_t3: 16777730;id9_R_t3: 2
//output// id8_R_t3: 16777730;id9_R_t3: 0
//output// id8_R_t3: 16777730;id9_R_t3: 1
//output// id8_R_t3: 16843008;id9_R_t3: 256
//output// id8_R_t3: 16842754;id9_R_t3: 1
//output// id8_R_t3: 16842752;id9_R_t3: 256
//output// id8_R_t3: 16777474;id9_R_t3: 0
//output// id8_R_t3: 16908800;id9_R_t3: 257
//output// id8_R_t3: 16843010;id9_R_t3: 1
//output// id8_R_t3: 16843008;id9_R_t3: 2
//output// id8_R_t3: 16843010;id9_R_t3: 0
//output// id8_R_t3: 16843008;id9_R_t3: 0
//output// id8_R_t3: 16843010;id9_R_t3: 2
//output// id8_R_t3: 65538;id9_R_t3: 256
//output// id8_R_t3: 16842754;id9_R_t3: 2
//output// id8_R_t3: 65794;id9_R_t3: 257
//output// id8_R_t3: 65794;id9_R_t3: 256
//output// id8_R_t3: 131328;id9_R_t3: 256
//output// id8_R_t3: 65794;id9_R_t3: 258
//output// id8_R_t3: 16843008;id9_R_t3: 1
//output// id8_R_t3: 16843266;id9_R_t3: 257
//output// id8_R_t3: 16843266;id9_R_t3: 256
//output// id8_R_t3: 0;id9_R_t3: 258
//output// id8_R_t3: 16842754;id9_R_t3: 256
//output// id8_R_t3: 512;id9_R_t3: 256
//output// id8_R_t3: 512;id9_R_t3: 257
//output// id8_R_t3: 16842754;id9_R_t3: 257
//output// id8_R_t3: 65792;id9_R_t3: 257
//output// id8_R_t3: 512;id9_R_t3: 258
//output// id8_R_t3: 0;id9_R_t3: 256
//output// id8_R_t3: 131584;id9_R_t3: 256
//output// id8_R_t3: 131072;id9_R_t3: 257
//output// id8_R_t3: 131072;id9_R_t3: 256
//output// id8_R_t3: 16843266;id9_R_t3: 258
//output// id8_R_t3: 256;id9_R_t3: 257
//output// id8_R_t3: 16908544;id9_R_t3: 258
//output// id8_R_t3: 131586;id9_R_t3: 258
//output// id8_R_t3: 131072;id9_R_t3: 258
//output// id8_R_t3: 16843010;id9_R_t3: 256
//output// id8_R_t3: 16843010;id9_R_t3: 257
//output// id8_R_t3: 16843010;id9_R_t3: 258
//output// id8_R_t3: 16908546;id9_R_t3: 258
//output// id8_R_t3: 65538;id9_R_t3: 258
//output// id8_R_t3: 65536;id9_R_t3: 0
//output// id8_R_t3: 65536;id9_R_t3: 1
//output// id8_R_t3: 131584;id9_R_t3: 0
//output// id8_R_t3: 131584;id9_R_t3: 1
//output// id8_R_t3: 131330;id9_R_t3: 257
//output// id8_R_t3: 16908288;id9_R_t3: 2
//output// id8_R_t3: 16908800;id9_R_t3: 1
//output// id8_R_t3: 16908288;id9_R_t3: 0
//output// id8_R_t3: 16908288;id9_R_t3: 1
//output// id8_R_t3: 16908546;id9_R_t3: 256
//output// id8_R_t3: 131584;id9_R_t3: 257
//output// id8_R_t3: 65792;id9_R_t3: 0
//output// id8_R_t3: 514;id9_R_t3: 2
//output// id8_R_t3: 514;id9_R_t3: 1
//output// id8_R_t3: 514;id9_R_t3: 0
//output// id8_R_t3: 16777472;id9_R_t3: 258
//output// id8_R_t3: 65792;id9_R_t3: 1
//output// id8_R_t3: 16908546;id9_R_t3: 257
//output// id8_R_t3: 131074;id9_R_t3: 256
//output// id8_R_t3: 65792;id9_R_t3: 2
//output// id8_R_t3: 16908802;id9_R_t3: 257
//output// id8_R_t3: 16908802;id9_R_t3: 256
//output// id8_R_t3: 66050;id9_R_t3: 257
//output// id8_R_t3: 66050;id9_R_t3: 256
//output// id8_R_t3: 66048;id9_R_t3: 1
//output// id8_R_t3: 65536;id9_R_t3: 258
//output// id8_R_t3: 65538;id9_R_t3: 2
//output// id8_R_t3: 66048;id9_R_t3: 2
//output// id8_R_t3: 65538;id9_R_t3: 0
//output// id8_R_t3: 65538;id9_R_t3: 1
//output// id8_R_t3: 16908290;id9_R_t3: 1
//output// id8_R_t3: 16908290;id9_R_t3: 0
//output// id8_R_t3: 16908290;id9_R_t3: 2
//output// id8_R_t3: 2;id9_R_t3: 256
//output// id8_R_t3: 2;id9_R_t3: 257
//output// id8_R_t3: 16842752;id9_R_t3: 257
//output// id8_R_t3: 16908802;id9_R_t3: 2
//output// id8_R_t3: 16908802;id9_R_t3: 0
//output// id8_R_t3: 16908802;id9_R_t3: 1
//output// id8_R_t3: 66048;id9_R_t3: 0
//output// id8_R_t3: 16908546;id9_R_t3: 1
//output// id8_R_t3: 2;id9_R_t3: 258
//output// id8_R_t3: 131586;id9_R_t3: 257
//output// id8_R_t3: 131586;id9_R_t3: 256
//output// id8_R_t3: 65794;id9_R_t3: 1
//output// id8_R_t3: 16777728;id9_R_t3: 1
//output// id8_R_t3: 16777728;id9_R_t3: 0
//output// id8_R_t3: 16777728;id9_R_t3: 2
//output// id8_R_t3: 131330;id9_R_t3: 1
//output// id8_R_t3: 131330;id9_R_t3: 0
//output// id8_R_t3: 131330;id9_R_t3: 2
//output// id8_R_t3: 0;id9_R_t3: 257
//output// id8_R_t3: 65794;id9_R_t3: 2
//output// id8_R_t3: 16908546;id9_R_t3: 2
//output// id8_R_t3: 65794;id9_R_t3: 0
//output// id8_R_t3: 16908546;id9_R_t3: 0
//output// id8_R_t3: 16843264;id9_R_t3: 258
//output// id8_R_t3: 16843264;id9_R_t3: 257
//output// id8_R_t3: 16843264;id9_R_t3: 256
//output// id8_R_t3: 16777728;id9_R_t3: 258
//output// id8_R_t3: 65792;id9_R_t3: 256
//output// id8_R_t3: 16777730;id9_R_t3: 258
//output// id8_R_t3: 66050;id9_R_t3: 258
//output// id8_R_t3: 16777730;id9_R_t3: 257
//output// id8_R_t3: 16777730;id9_R_t3: 256
//output// id8_R_t3: 16908802;id9_R_t3: 258
//output// id8_R_t3: 258;id9_R_t3: 258
//output// id8_R_t3: 16908288;id9_R_t3: 258
//output// id8_R_t3: 131330;id9_R_t3: 256
//output// id8_R_t3: 16777472;id9_R_t3: 2
//output// id8_R_t3: 16777472;id9_R_t3: 1
//output// id8_R_t3: 16842752;id9_R_t3: 0
//output// id8_R_t3: 131330;id9_R_t3: 258
//output// id8_R_t3: 16908288;id9_R_t3: 257
//output// id8_R_t3: 16908288;id9_R_t3: 256
//output// id8_R_t3: 16777474;id9_R_t3: 256
//output// id8_R_t3: 16777474;id9_R_t3: 257
//output// id8_R_t3: 16908800;id9_R_t3: 258
//output// id8_R_t3: 131328;id9_R_t3: 258
//output// id8_R_t3: 131328;id9_R_t3: 2
//output// id8_R_t3: 131328;id9_R_t3: 0
//output// id8_R_t3: 131328;id9_R_t3: 1
//output// id8_R_t3: 0;id9_R_t3: 1
