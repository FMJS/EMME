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
//4lw=
