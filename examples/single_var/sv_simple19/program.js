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
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 2, 2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 3, 2);
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
outputs[1] = "id8_R_t3: 1;id9_R_t3: 0";
outputs[2] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[3] = "id8_R_t3: 257;id9_R_t3: 0";
outputs[4] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[5] = "id8_R_t3: 65537;id9_R_t3: 0";
outputs[6] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[7] = "id8_R_t3: 65793;id9_R_t3: 0";
outputs[8] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[9] = "id8_R_t3: 513;id9_R_t3: 0";
outputs[10] = "id8_R_t3: 66048;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 66049;id9_R_t3: 0";
outputs[12] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[13] = "id8_R_t3: 131073;id9_R_t3: 0";
outputs[14] = "id8_R_t3: 131328;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 131329;id9_R_t3: 0";
outputs[16] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[17] = "id8_R_t3: 131585;id9_R_t3: 0";
outputs[18] = "id8_R_t3: 33554432;id9_R_t3: 0";
outputs[19] = "id8_R_t3: 33554433;id9_R_t3: 0";
outputs[20] = "id8_R_t3: 33554688;id9_R_t3: 0";
outputs[21] = "id8_R_t3: 33554689;id9_R_t3: 0";
outputs[22] = "id8_R_t3: 33619968;id9_R_t3: 0";
outputs[23] = "id8_R_t3: 33619969;id9_R_t3: 0";
outputs[24] = "id8_R_t3: 33620224;id9_R_t3: 0";
outputs[25] = "id8_R_t3: 33620225;id9_R_t3: 0";
outputs[26] = "id8_R_t3: 33554944;id9_R_t3: 0";
outputs[27] = "id8_R_t3: 33554945;id9_R_t3: 0";
outputs[28] = "id8_R_t3: 33620480;id9_R_t3: 0";
outputs[29] = "id8_R_t3: 33620481;id9_R_t3: 0";
outputs[30] = "id8_R_t3: 33685504;id9_R_t3: 0";
outputs[31] = "id8_R_t3: 33685505;id9_R_t3: 0";
outputs[32] = "id8_R_t3: 33685760;id9_R_t3: 0";
outputs[33] = "id8_R_t3: 33685761;id9_R_t3: 0";
outputs[34] = "id8_R_t3: 33686016;id9_R_t3: 0";
outputs[35] = "id8_R_t3: 33686017;id9_R_t3: 0";
outputs[36] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[37] = "id8_R_t3: 1;id9_R_t3: 1";
outputs[38] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[39] = "id8_R_t3: 257;id9_R_t3: 1";
outputs[40] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[41] = "id8_R_t3: 65537;id9_R_t3: 1";
outputs[42] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[43] = "id8_R_t3: 65793;id9_R_t3: 1";
outputs[44] = "id8_R_t3: 512;id9_R_t3: 1";
outputs[45] = "id8_R_t3: 513;id9_R_t3: 1";
outputs[46] = "id8_R_t3: 66048;id9_R_t3: 1";
outputs[47] = "id8_R_t3: 66049;id9_R_t3: 1";
outputs[48] = "id8_R_t3: 131072;id9_R_t3: 1";
outputs[49] = "id8_R_t3: 131073;id9_R_t3: 1";
outputs[50] = "id8_R_t3: 131328;id9_R_t3: 1";
outputs[51] = "id8_R_t3: 131329;id9_R_t3: 1";
outputs[52] = "id8_R_t3: 131584;id9_R_t3: 1";
outputs[53] = "id8_R_t3: 131585;id9_R_t3: 1";
outputs[54] = "id8_R_t3: 33554432;id9_R_t3: 1";
outputs[55] = "id8_R_t3: 33554433;id9_R_t3: 1";
outputs[56] = "id8_R_t3: 33554688;id9_R_t3: 1";
outputs[57] = "id8_R_t3: 33554689;id9_R_t3: 1";
outputs[58] = "id8_R_t3: 33619968;id9_R_t3: 1";
outputs[59] = "id8_R_t3: 33619969;id9_R_t3: 1";
outputs[60] = "id8_R_t3: 33620224;id9_R_t3: 1";
outputs[61] = "id8_R_t3: 33620225;id9_R_t3: 1";
outputs[62] = "id8_R_t3: 33554944;id9_R_t3: 1";
outputs[63] = "id8_R_t3: 33554945;id9_R_t3: 1";
outputs[64] = "id8_R_t3: 33620480;id9_R_t3: 1";
outputs[65] = "id8_R_t3: 33620481;id9_R_t3: 1";
outputs[66] = "id8_R_t3: 33685504;id9_R_t3: 1";
outputs[67] = "id8_R_t3: 33685505;id9_R_t3: 1";
outputs[68] = "id8_R_t3: 33685760;id9_R_t3: 1";
outputs[69] = "id8_R_t3: 33685761;id9_R_t3: 1";
outputs[70] = "id8_R_t3: 33686016;id9_R_t3: 1";
outputs[71] = "id8_R_t3: 33686017;id9_R_t3: 1";
outputs[72] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[73] = "id8_R_t3: 1;id9_R_t3: 2";
outputs[74] = "id8_R_t3: 256;id9_R_t3: 2";
outputs[75] = "id8_R_t3: 257;id9_R_t3: 2";
outputs[76] = "id8_R_t3: 65536;id9_R_t3: 2";
outputs[77] = "id8_R_t3: 65537;id9_R_t3: 2";
outputs[78] = "id8_R_t3: 65792;id9_R_t3: 2";
outputs[79] = "id8_R_t3: 65793;id9_R_t3: 2";
outputs[80] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[81] = "id8_R_t3: 513;id9_R_t3: 2";
outputs[82] = "id8_R_t3: 66048;id9_R_t3: 2";
outputs[83] = "id8_R_t3: 66049;id9_R_t3: 2";
outputs[84] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[85] = "id8_R_t3: 131073;id9_R_t3: 2";
outputs[86] = "id8_R_t3: 131328;id9_R_t3: 2";
outputs[87] = "id8_R_t3: 131329;id9_R_t3: 2";
outputs[88] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[89] = "id8_R_t3: 131585;id9_R_t3: 2";
outputs[90] = "id8_R_t3: 33554432;id9_R_t3: 2";
outputs[91] = "id8_R_t3: 33554433;id9_R_t3: 2";
outputs[92] = "id8_R_t3: 33554688;id9_R_t3: 2";
outputs[93] = "id8_R_t3: 33554689;id9_R_t3: 2";
outputs[94] = "id8_R_t3: 33619968;id9_R_t3: 2";
outputs[95] = "id8_R_t3: 33619969;id9_R_t3: 2";
outputs[96] = "id8_R_t3: 33620224;id9_R_t3: 2";
outputs[97] = "id8_R_t3: 33620225;id9_R_t3: 2";
outputs[98] = "id8_R_t3: 33554944;id9_R_t3: 2";
outputs[99] = "id8_R_t3: 33554945;id9_R_t3: 2";
outputs[100] = "id8_R_t3: 33620480;id9_R_t3: 2";
outputs[101] = "id8_R_t3: 33620481;id9_R_t3: 2";
outputs[102] = "id8_R_t3: 33685504;id9_R_t3: 2";
outputs[103] = "id8_R_t3: 33685505;id9_R_t3: 2";
outputs[104] = "id8_R_t3: 33685760;id9_R_t3: 2";
outputs[105] = "id8_R_t3: 33685761;id9_R_t3: 2";
outputs[106] = "id8_R_t3: 33686016;id9_R_t3: 2";
outputs[107] = "id8_R_t3: 33686017;id9_R_t3: 2";
outputs[108] = "id8_R_t3: 0;id9_R_t3: 512";
outputs[109] = "id8_R_t3: 1;id9_R_t3: 512";
outputs[110] = "id8_R_t3: 256;id9_R_t3: 512";
outputs[111] = "id8_R_t3: 257;id9_R_t3: 512";
outputs[112] = "id8_R_t3: 65536;id9_R_t3: 512";
outputs[113] = "id8_R_t3: 65537;id9_R_t3: 512";
outputs[114] = "id8_R_t3: 65792;id9_R_t3: 512";
outputs[115] = "id8_R_t3: 65793;id9_R_t3: 512";
outputs[116] = "id8_R_t3: 512;id9_R_t3: 512";
outputs[117] = "id8_R_t3: 513;id9_R_t3: 512";
outputs[118] = "id8_R_t3: 66048;id9_R_t3: 512";
outputs[119] = "id8_R_t3: 66049;id9_R_t3: 512";
outputs[120] = "id8_R_t3: 131072;id9_R_t3: 512";
outputs[121] = "id8_R_t3: 131073;id9_R_t3: 512";
outputs[122] = "id8_R_t3: 131328;id9_R_t3: 512";
outputs[123] = "id8_R_t3: 131329;id9_R_t3: 512";
outputs[124] = "id8_R_t3: 131584;id9_R_t3: 512";
outputs[125] = "id8_R_t3: 131585;id9_R_t3: 512";
outputs[126] = "id8_R_t3: 33554432;id9_R_t3: 512";
outputs[127] = "id8_R_t3: 33554433;id9_R_t3: 512";
outputs[128] = "id8_R_t3: 33554688;id9_R_t3: 512";
outputs[129] = "id8_R_t3: 33554689;id9_R_t3: 512";
outputs[130] = "id8_R_t3: 33619968;id9_R_t3: 512";
outputs[131] = "id8_R_t3: 33619969;id9_R_t3: 512";
outputs[132] = "id8_R_t3: 33620224;id9_R_t3: 512";
outputs[133] = "id8_R_t3: 33620225;id9_R_t3: 512";
outputs[134] = "id8_R_t3: 33554944;id9_R_t3: 512";
outputs[135] = "id8_R_t3: 33554945;id9_R_t3: 512";
outputs[136] = "id8_R_t3: 33620480;id9_R_t3: 512";
outputs[137] = "id8_R_t3: 33620481;id9_R_t3: 512";
outputs[138] = "id8_R_t3: 33685504;id9_R_t3: 512";
outputs[139] = "id8_R_t3: 33685505;id9_R_t3: 512";
outputs[140] = "id8_R_t3: 33685760;id9_R_t3: 512";
outputs[141] = "id8_R_t3: 33685761;id9_R_t3: 512";
outputs[142] = "id8_R_t3: 33686016;id9_R_t3: 512";
outputs[143] = "id8_R_t3: 33686017;id9_R_t3: 512";
outputs[144] = "id8_R_t3: 0;id9_R_t3: 513";
outputs[145] = "id8_R_t3: 1;id9_R_t3: 513";
outputs[146] = "id8_R_t3: 256;id9_R_t3: 513";
outputs[147] = "id8_R_t3: 257;id9_R_t3: 513";
outputs[148] = "id8_R_t3: 65536;id9_R_t3: 513";
outputs[149] = "id8_R_t3: 65537;id9_R_t3: 513";
outputs[150] = "id8_R_t3: 65792;id9_R_t3: 513";
outputs[151] = "id8_R_t3: 65793;id9_R_t3: 513";
outputs[152] = "id8_R_t3: 512;id9_R_t3: 513";
outputs[153] = "id8_R_t3: 513;id9_R_t3: 513";
outputs[154] = "id8_R_t3: 66048;id9_R_t3: 513";
outputs[155] = "id8_R_t3: 66049;id9_R_t3: 513";
outputs[156] = "id8_R_t3: 131072;id9_R_t3: 513";
outputs[157] = "id8_R_t3: 131073;id9_R_t3: 513";
outputs[158] = "id8_R_t3: 131328;id9_R_t3: 513";
outputs[159] = "id8_R_t3: 131329;id9_R_t3: 513";
outputs[160] = "id8_R_t3: 131584;id9_R_t3: 513";
outputs[161] = "id8_R_t3: 131585;id9_R_t3: 513";
outputs[162] = "id8_R_t3: 33554432;id9_R_t3: 513";
outputs[163] = "id8_R_t3: 33554433;id9_R_t3: 513";
outputs[164] = "id8_R_t3: 33554688;id9_R_t3: 513";
outputs[165] = "id8_R_t3: 33554689;id9_R_t3: 513";
outputs[166] = "id8_R_t3: 33619968;id9_R_t3: 513";
outputs[167] = "id8_R_t3: 33619969;id9_R_t3: 513";
outputs[168] = "id8_R_t3: 33620224;id9_R_t3: 513";
outputs[169] = "id8_R_t3: 33620225;id9_R_t3: 513";
outputs[170] = "id8_R_t3: 33554944;id9_R_t3: 513";
outputs[171] = "id8_R_t3: 33554945;id9_R_t3: 513";
outputs[172] = "id8_R_t3: 33620480;id9_R_t3: 513";
outputs[173] = "id8_R_t3: 33620481;id9_R_t3: 513";
outputs[174] = "id8_R_t3: 33685504;id9_R_t3: 513";
outputs[175] = "id8_R_t3: 33685505;id9_R_t3: 513";
outputs[176] = "id8_R_t3: 33685760;id9_R_t3: 513";
outputs[177] = "id8_R_t3: 33685761;id9_R_t3: 513";
outputs[178] = "id8_R_t3: 33686016;id9_R_t3: 513";
outputs[179] = "id8_R_t3: 33686017;id9_R_t3: 513";
outputs[180] = "id8_R_t3: 0;id9_R_t3: 514";
outputs[181] = "id8_R_t3: 1;id9_R_t3: 514";
outputs[182] = "id8_R_t3: 256;id9_R_t3: 514";
outputs[183] = "id8_R_t3: 257;id9_R_t3: 514";
outputs[184] = "id8_R_t3: 65536;id9_R_t3: 514";
outputs[185] = "id8_R_t3: 65537;id9_R_t3: 514";
outputs[186] = "id8_R_t3: 65792;id9_R_t3: 514";
outputs[187] = "id8_R_t3: 65793;id9_R_t3: 514";
outputs[188] = "id8_R_t3: 512;id9_R_t3: 514";
outputs[189] = "id8_R_t3: 513;id9_R_t3: 514";
outputs[190] = "id8_R_t3: 66048;id9_R_t3: 514";
outputs[191] = "id8_R_t3: 66049;id9_R_t3: 514";
outputs[192] = "id8_R_t3: 131072;id9_R_t3: 514";
outputs[193] = "id8_R_t3: 131073;id9_R_t3: 514";
outputs[194] = "id8_R_t3: 131328;id9_R_t3: 514";
outputs[195] = "id8_R_t3: 131329;id9_R_t3: 514";
outputs[196] = "id8_R_t3: 131584;id9_R_t3: 514";
outputs[197] = "id8_R_t3: 131585;id9_R_t3: 514";
outputs[198] = "id8_R_t3: 33554432;id9_R_t3: 514";
outputs[199] = "id8_R_t3: 33554433;id9_R_t3: 514";
outputs[200] = "id8_R_t3: 33554688;id9_R_t3: 514";
outputs[201] = "id8_R_t3: 33554689;id9_R_t3: 514";
outputs[202] = "id8_R_t3: 33619968;id9_R_t3: 514";
outputs[203] = "id8_R_t3: 33619969;id9_R_t3: 514";
outputs[204] = "id8_R_t3: 33620224;id9_R_t3: 514";
outputs[205] = "id8_R_t3: 33620225;id9_R_t3: 514";
outputs[206] = "id8_R_t3: 33554944;id9_R_t3: 514";
outputs[207] = "id8_R_t3: 33554945;id9_R_t3: 514";
outputs[208] = "id8_R_t3: 33620480;id9_R_t3: 514";
outputs[209] = "id8_R_t3: 33620481;id9_R_t3: 514";
outputs[210] = "id8_R_t3: 33685504;id9_R_t3: 514";
outputs[211] = "id8_R_t3: 33685505;id9_R_t3: 514";
outputs[212] = "id8_R_t3: 33685760;id9_R_t3: 514";
outputs[213] = "id8_R_t3: 33685761;id9_R_t3: 514";
outputs[214] = "id8_R_t3: 33686016;id9_R_t3: 514";
outputs[215] = "id8_R_t3: 33686017;id9_R_t3: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
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
//ZnygzQe1G8nOs8H/AYQu354=
