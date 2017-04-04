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
outputs[0] = "id8_R_t3: 33685760;id9_R_t3: 0";
outputs[1] = "id8_R_t3: 33685760;id9_R_t3: 1";
outputs[2] = "id8_R_t3: 33685760;id9_R_t3: 2";
outputs[3] = "id8_R_t3: 131328;id9_R_t3: 512";
outputs[4] = "id8_R_t3: 33554945;id9_R_t3: 514";
outputs[5] = "id8_R_t3: 33554945;id9_R_t3: 512";
outputs[6] = "id8_R_t3: 33554945;id9_R_t3: 513";
outputs[7] = "id8_R_t3: 33554688;id9_R_t3: 512";
outputs[8] = "id8_R_t3: 33554688;id9_R_t3: 513";
outputs[9] = "id8_R_t3: 256;id9_R_t3: 2";
outputs[10] = "id8_R_t3: 256;id9_R_t3: 0";
outputs[11] = "id8_R_t3: 256;id9_R_t3: 1";
outputs[12] = "id8_R_t3: 33619969;id9_R_t3: 514";
outputs[13] = "id8_R_t3: 0;id9_R_t3: 514";
outputs[14] = "id8_R_t3: 131072;id9_R_t3: 0";
outputs[15] = "id8_R_t3: 131072;id9_R_t3: 1";
outputs[16] = "id8_R_t3: 131072;id9_R_t3: 2";
outputs[17] = "id8_R_t3: 0;id9_R_t3: 0";
outputs[18] = "id8_R_t3: 33554689;id9_R_t3: 1";
outputs[19] = "id8_R_t3: 33554689;id9_R_t3: 0";
outputs[20] = "id8_R_t3: 33554689;id9_R_t3: 2";
outputs[21] = "id8_R_t3: 33685504;id9_R_t3: 0";
outputs[22] = "id8_R_t3: 33685504;id9_R_t3: 1";
outputs[23] = "id8_R_t3: 33685504;id9_R_t3: 2";
outputs[24] = "id8_R_t3: 131585;id9_R_t3: 2";
outputs[25] = "id8_R_t3: 131585;id9_R_t3: 1";
outputs[26] = "id8_R_t3: 131585;id9_R_t3: 0";
outputs[27] = "id8_R_t3: 33685504;id9_R_t3: 512";
outputs[28] = "id8_R_t3: 33685504;id9_R_t3: 513";
outputs[29] = "id8_R_t3: 33685504;id9_R_t3: 514";
outputs[30] = "id8_R_t3: 33619968;id9_R_t3: 514";
outputs[31] = "id8_R_t3: 33619968;id9_R_t3: 513";
outputs[32] = "id8_R_t3: 33619968;id9_R_t3: 512";
outputs[33] = "id8_R_t3: 33685505;id9_R_t3: 513";
outputs[34] = "id8_R_t3: 33620480;id9_R_t3: 0";
outputs[35] = "id8_R_t3: 33620480;id9_R_t3: 1";
outputs[36] = "id8_R_t3: 33620480;id9_R_t3: 2";
outputs[37] = "id8_R_t3: 33554688;id9_R_t3: 0";
outputs[38] = "id8_R_t3: 33554688;id9_R_t3: 1";
outputs[39] = "id8_R_t3: 33554688;id9_R_t3: 2";
outputs[40] = "id8_R_t3: 33686016;id9_R_t3: 512";
outputs[41] = "id8_R_t3: 65792;id9_R_t3: 2";
outputs[42] = "id8_R_t3: 33685505;id9_R_t3: 512";
outputs[43] = "id8_R_t3: 131584;id9_R_t3: 2";
outputs[44] = "id8_R_t3: 33620481;id9_R_t3: 1";
outputs[45] = "id8_R_t3: 33620481;id9_R_t3: 0";
outputs[46] = "id8_R_t3: 33554433;id9_R_t3: 512";
outputs[47] = "id8_R_t3: 33620481;id9_R_t3: 2";
outputs[48] = "id8_R_t3: 1;id9_R_t3: 512";
outputs[49] = "id8_R_t3: 1;id9_R_t3: 513";
outputs[50] = "id8_R_t3: 66048;id9_R_t3: 512";
outputs[51] = "id8_R_t3: 65536;id9_R_t3: 2";
outputs[52] = "id8_R_t3: 33685760;id9_R_t3: 513";
outputs[53] = "id8_R_t3: 512;id9_R_t3: 1";
outputs[54] = "id8_R_t3: 512;id9_R_t3: 0";
outputs[55] = "id8_R_t3: 512;id9_R_t3: 2";
outputs[56] = "id8_R_t3: 33620481;id9_R_t3: 514";
outputs[57] = "id8_R_t3: 33554945;id9_R_t3: 2";
outputs[58] = "id8_R_t3: 257;id9_R_t3: 2";
outputs[59] = "id8_R_t3: 33554945;id9_R_t3: 0";
outputs[60] = "id8_R_t3: 257;id9_R_t3: 0";
outputs[61] = "id8_R_t3: 33685761;id9_R_t3: 1";
outputs[62] = "id8_R_t3: 33685761;id9_R_t3: 0";
outputs[63] = "id8_R_t3: 33685761;id9_R_t3: 2";
outputs[64] = "id8_R_t3: 0;id9_R_t3: 2";
outputs[65] = "id8_R_t3: 131329;id9_R_t3: 513";
outputs[66] = "id8_R_t3: 131329;id9_R_t3: 512";
outputs[67] = "id8_R_t3: 33554433;id9_R_t3: 513";
outputs[68] = "id8_R_t3: 0;id9_R_t3: 1";
outputs[69] = "id8_R_t3: 131329;id9_R_t3: 514";
outputs[70] = "id8_R_t3: 33554432;id9_R_t3: 1";
outputs[71] = "id8_R_t3: 33554432;id9_R_t3: 0";
outputs[72] = "id8_R_t3: 33686016;id9_R_t3: 513";
outputs[73] = "id8_R_t3: 33554432;id9_R_t3: 2";
outputs[74] = "id8_R_t3: 33686016;id9_R_t3: 514";
outputs[75] = "id8_R_t3: 33554944;id9_R_t3: 514";
outputs[76] = "id8_R_t3: 33554944;id9_R_t3: 513";
outputs[77] = "id8_R_t3: 33554944;id9_R_t3: 512";
outputs[78] = "id8_R_t3: 33554688;id9_R_t3: 514";
outputs[79] = "id8_R_t3: 256;id9_R_t3: 514";
outputs[80] = "id8_R_t3: 33554432;id9_R_t3: 513";
outputs[81] = "id8_R_t3: 33554432;id9_R_t3: 512";
outputs[82] = "id8_R_t3: 33619969;id9_R_t3: 512";
outputs[83] = "id8_R_t3: 257;id9_R_t3: 512";
outputs[84] = "id8_R_t3: 33686017;id9_R_t3: 0";
outputs[85] = "id8_R_t3: 33686017;id9_R_t3: 1";
outputs[86] = "id8_R_t3: 33686017;id9_R_t3: 2";
outputs[87] = "id8_R_t3: 257;id9_R_t3: 514";
outputs[88] = "id8_R_t3: 65536;id9_R_t3: 512";
outputs[89] = "id8_R_t3: 65536;id9_R_t3: 513";
outputs[90] = "id8_R_t3: 65536;id9_R_t3: 514";
outputs[91] = "id8_R_t3: 33554432;id9_R_t3: 514";
outputs[92] = "id8_R_t3: 33554433;id9_R_t3: 514";
outputs[93] = "id8_R_t3: 33620224;id9_R_t3: 514";
outputs[94] = "id8_R_t3: 33620224;id9_R_t3: 512";
outputs[95] = "id8_R_t3: 33620224;id9_R_t3: 513";
outputs[96] = "id8_R_t3: 65792;id9_R_t3: 512";
outputs[97] = "id8_R_t3: 65792;id9_R_t3: 513";
outputs[98] = "id8_R_t3: 65792;id9_R_t3: 514";
outputs[99] = "id8_R_t3: 131585;id9_R_t3: 514";
outputs[100] = "id8_R_t3: 33554689;id9_R_t3: 514";
outputs[101] = "id8_R_t3: 33554689;id9_R_t3: 513";
outputs[102] = "id8_R_t3: 33554689;id9_R_t3: 512";
outputs[103] = "id8_R_t3: 513;id9_R_t3: 0";
outputs[104] = "id8_R_t3: 513;id9_R_t3: 1";
outputs[105] = "id8_R_t3: 513;id9_R_t3: 2";
outputs[106] = "id8_R_t3: 66048;id9_R_t3: 514";
outputs[107] = "id8_R_t3: 65536;id9_R_t3: 0";
outputs[108] = "id8_R_t3: 65536;id9_R_t3: 1";
outputs[109] = "id8_R_t3: 131584;id9_R_t3: 0";
outputs[110] = "id8_R_t3: 131584;id9_R_t3: 1";
outputs[111] = "id8_R_t3: 33686016;id9_R_t3: 1";
outputs[112] = "id8_R_t3: 33686016;id9_R_t3: 0";
outputs[113] = "id8_R_t3: 33686016;id9_R_t3: 2";
outputs[114] = "id8_R_t3: 33620224;id9_R_t3: 0";
outputs[115] = "id8_R_t3: 33620224;id9_R_t3: 1";
outputs[116] = "id8_R_t3: 33620224;id9_R_t3: 2";
outputs[117] = "id8_R_t3: 65792;id9_R_t3: 0";
outputs[118] = "id8_R_t3: 65792;id9_R_t3: 1";
outputs[119] = "id8_R_t3: 1;id9_R_t3: 0";
outputs[120] = "id8_R_t3: 1;id9_R_t3: 1";
outputs[121] = "id8_R_t3: 1;id9_R_t3: 2";
outputs[122] = "id8_R_t3: 33620480;id9_R_t3: 512";
outputs[123] = "id8_R_t3: 33620480;id9_R_t3: 513";
outputs[124] = "id8_R_t3: 33620480;id9_R_t3: 514";
outputs[125] = "id8_R_t3: 33619968;id9_R_t3: 2";
outputs[126] = "id8_R_t3: 131328;id9_R_t3: 2";
outputs[127] = "id8_R_t3: 33620225;id9_R_t3: 1";
outputs[128] = "id8_R_t3: 33619968;id9_R_t3: 1";
outputs[129] = "id8_R_t3: 33620225;id9_R_t3: 2";
outputs[130] = "id8_R_t3: 33619969;id9_R_t3: 513";
outputs[131] = "id8_R_t3: 33619968;id9_R_t3: 0";
outputs[132] = "id8_R_t3: 66049;id9_R_t3: 0";
outputs[133] = "id8_R_t3: 513;id9_R_t3: 514";
outputs[134] = "id8_R_t3: 66049;id9_R_t3: 1";
outputs[135] = "id8_R_t3: 513;id9_R_t3: 512";
outputs[136] = "id8_R_t3: 513;id9_R_t3: 513";
outputs[137] = "id8_R_t3: 66048;id9_R_t3: 2";
outputs[138] = "id8_R_t3: 66048;id9_R_t3: 1";
outputs[139] = "id8_R_t3: 66048;id9_R_t3: 0";
outputs[140] = "id8_R_t3: 131585;id9_R_t3: 513";
outputs[141] = "id8_R_t3: 131585;id9_R_t3: 512";
outputs[142] = "id8_R_t3: 131073;id9_R_t3: 513";
outputs[143] = "id8_R_t3: 131073;id9_R_t3: 512";
outputs[144] = "id8_R_t3: 131073;id9_R_t3: 514";
outputs[145] = "id8_R_t3: 33685761;id9_R_t3: 513";
outputs[146] = "id8_R_t3: 33685761;id9_R_t3: 512";
outputs[147] = "id8_R_t3: 33685761;id9_R_t3: 514";
outputs[148] = "id8_R_t3: 33686017;id9_R_t3: 514";
outputs[149] = "id8_R_t3: 33686017;id9_R_t3: 512";
outputs[150] = "id8_R_t3: 33686017;id9_R_t3: 513";
outputs[151] = "id8_R_t3: 257;id9_R_t3: 1";
outputs[152] = "id8_R_t3: 33554945;id9_R_t3: 1";
outputs[153] = "id8_R_t3: 257;id9_R_t3: 513";
outputs[154] = "id8_R_t3: 33685760;id9_R_t3: 514";
outputs[155] = "id8_R_t3: 65537;id9_R_t3: 1";
outputs[156] = "id8_R_t3: 65537;id9_R_t3: 0";
outputs[157] = "id8_R_t3: 33685760;id9_R_t3: 512";
outputs[158] = "id8_R_t3: 65537;id9_R_t3: 2";
outputs[159] = "id8_R_t3: 33554433;id9_R_t3: 0";
outputs[160] = "id8_R_t3: 33554433;id9_R_t3: 1";
outputs[161] = "id8_R_t3: 33554433;id9_R_t3: 2";
outputs[162] = "id8_R_t3: 33620481;id9_R_t3: 513";
outputs[163] = "id8_R_t3: 33620225;id9_R_t3: 0";
outputs[164] = "id8_R_t3: 66049;id9_R_t3: 512";
outputs[165] = "id8_R_t3: 131329;id9_R_t3: 2";
outputs[166] = "id8_R_t3: 131329;id9_R_t3: 1";
outputs[167] = "id8_R_t3: 131329;id9_R_t3: 0";
outputs[168] = "id8_R_t3: 131073;id9_R_t3: 1";
outputs[169] = "id8_R_t3: 131073;id9_R_t3: 0";
outputs[170] = "id8_R_t3: 66049;id9_R_t3: 514";
outputs[171] = "id8_R_t3: 131073;id9_R_t3: 2";
outputs[172] = "id8_R_t3: 0;id9_R_t3: 513";
outputs[173] = "id8_R_t3: 0;id9_R_t3: 512";
outputs[174] = "id8_R_t3: 131328;id9_R_t3: 514";
outputs[175] = "id8_R_t3: 1;id9_R_t3: 514";
outputs[176] = "id8_R_t3: 33619969;id9_R_t3: 2";
outputs[177] = "id8_R_t3: 131328;id9_R_t3: 513";
outputs[178] = "id8_R_t3: 33619969;id9_R_t3: 0";
outputs[179] = "id8_R_t3: 33619969;id9_R_t3: 1";
outputs[180] = "id8_R_t3: 33685505;id9_R_t3: 1";
outputs[181] = "id8_R_t3: 33685505;id9_R_t3: 0";
outputs[182] = "id8_R_t3: 33685505;id9_R_t3: 2";
outputs[183] = "id8_R_t3: 65793;id9_R_t3: 1";
outputs[184] = "id8_R_t3: 65793;id9_R_t3: 0";
outputs[185] = "id8_R_t3: 65793;id9_R_t3: 2";
outputs[186] = "id8_R_t3: 131584;id9_R_t3: 512";
outputs[187] = "id8_R_t3: 131584;id9_R_t3: 513";
outputs[188] = "id8_R_t3: 33620481;id9_R_t3: 512";
outputs[189] = "id8_R_t3: 33554944;id9_R_t3: 2";
outputs[190] = "id8_R_t3: 33554944;id9_R_t3: 1";
outputs[191] = "id8_R_t3: 33554944;id9_R_t3: 0";
outputs[192] = "id8_R_t3: 33685505;id9_R_t3: 514";
outputs[193] = "id8_R_t3: 512;id9_R_t3: 513";
outputs[194] = "id8_R_t3: 512;id9_R_t3: 512";
outputs[195] = "id8_R_t3: 131584;id9_R_t3: 514";
outputs[196] = "id8_R_t3: 512;id9_R_t3: 514";
outputs[197] = "id8_R_t3: 66049;id9_R_t3: 513";
outputs[198] = "id8_R_t3: 131072;id9_R_t3: 514";
outputs[199] = "id8_R_t3: 33620225;id9_R_t3: 513";
outputs[200] = "id8_R_t3: 33620225;id9_R_t3: 512";
outputs[201] = "id8_R_t3: 33620225;id9_R_t3: 514";
outputs[202] = "id8_R_t3: 131072;id9_R_t3: 512";
outputs[203] = "id8_R_t3: 131072;id9_R_t3: 513";
outputs[204] = "id8_R_t3: 65537;id9_R_t3: 514";
outputs[205] = "id8_R_t3: 65537;id9_R_t3: 513";
outputs[206] = "id8_R_t3: 65537;id9_R_t3: 512";
outputs[207] = "id8_R_t3: 66049;id9_R_t3: 2";
outputs[208] = "id8_R_t3: 131328;id9_R_t3: 0";
outputs[209] = "id8_R_t3: 131328;id9_R_t3: 1";
outputs[210] = "id8_R_t3: 256;id9_R_t3: 512";
outputs[211] = "id8_R_t3: 256;id9_R_t3: 513";
outputs[212] = "id8_R_t3: 66048;id9_R_t3: 513";
outputs[213] = "id8_R_t3: 65793;id9_R_t3: 514";
outputs[214] = "id8_R_t3: 65793;id9_R_t3: 513";
outputs[215] = "id8_R_t3: 65793;id9_R_t3: 512";
assert(-1 != outputs.indexOf(report));

// Expected outputs //
//output// id8_R_t3: 33685760;id9_R_t3: 0
//output// id8_R_t3: 33685760;id9_R_t3: 1
//output// id8_R_t3: 33685760;id9_R_t3: 2
//output// id8_R_t3: 131328;id9_R_t3: 512
//output// id8_R_t3: 33554945;id9_R_t3: 514
//output// id8_R_t3: 33554945;id9_R_t3: 512
//output// id8_R_t3: 33554945;id9_R_t3: 513
//output// id8_R_t3: 33554688;id9_R_t3: 512
//output// id8_R_t3: 33554688;id9_R_t3: 513
//output// id8_R_t3: 256;id9_R_t3: 2
//output// id8_R_t3: 256;id9_R_t3: 0
//output// id8_R_t3: 256;id9_R_t3: 1
//output// id8_R_t3: 33619969;id9_R_t3: 514
//output// id8_R_t3: 0;id9_R_t3: 514
//output// id8_R_t3: 131072;id9_R_t3: 0
//output// id8_R_t3: 131072;id9_R_t3: 1
//output// id8_R_t3: 131072;id9_R_t3: 2
//output// id8_R_t3: 0;id9_R_t3: 0
//output// id8_R_t3: 33554689;id9_R_t3: 1
//output// id8_R_t3: 33554689;id9_R_t3: 0
//output// id8_R_t3: 33554689;id9_R_t3: 2
//output// id8_R_t3: 33685504;id9_R_t3: 0
//output// id8_R_t3: 33685504;id9_R_t3: 1
//output// id8_R_t3: 33685504;id9_R_t3: 2
//output// id8_R_t3: 131585;id9_R_t3: 2
//output// id8_R_t3: 131585;id9_R_t3: 1
//output// id8_R_t3: 131585;id9_R_t3: 0
//output// id8_R_t3: 33685504;id9_R_t3: 512
//output// id8_R_t3: 33685504;id9_R_t3: 513
//output// id8_R_t3: 33685504;id9_R_t3: 514
//output// id8_R_t3: 33619968;id9_R_t3: 514
//output// id8_R_t3: 33619968;id9_R_t3: 513
//output// id8_R_t3: 33619968;id9_R_t3: 512
//output// id8_R_t3: 33685505;id9_R_t3: 513
//output// id8_R_t3: 33620480;id9_R_t3: 0
//output// id8_R_t3: 33620480;id9_R_t3: 1
//output// id8_R_t3: 33620480;id9_R_t3: 2
//output// id8_R_t3: 33554688;id9_R_t3: 0
//output// id8_R_t3: 33554688;id9_R_t3: 1
//output// id8_R_t3: 33554688;id9_R_t3: 2
//output// id8_R_t3: 33686016;id9_R_t3: 512
//output// id8_R_t3: 65792;id9_R_t3: 2
//output// id8_R_t3: 33685505;id9_R_t3: 512
//output// id8_R_t3: 131584;id9_R_t3: 2
//output// id8_R_t3: 33620481;id9_R_t3: 1
//output// id8_R_t3: 33620481;id9_R_t3: 0
//output// id8_R_t3: 33554433;id9_R_t3: 512
//output// id8_R_t3: 33620481;id9_R_t3: 2
//output// id8_R_t3: 1;id9_R_t3: 512
//output// id8_R_t3: 1;id9_R_t3: 513
//output// id8_R_t3: 66048;id9_R_t3: 512
//output// id8_R_t3: 65536;id9_R_t3: 2
//output// id8_R_t3: 33685760;id9_R_t3: 513
//output// id8_R_t3: 512;id9_R_t3: 1
//output// id8_R_t3: 512;id9_R_t3: 0
//output// id8_R_t3: 512;id9_R_t3: 2
//output// id8_R_t3: 33620481;id9_R_t3: 514
//output// id8_R_t3: 33554945;id9_R_t3: 2
//output// id8_R_t3: 257;id9_R_t3: 2
//output// id8_R_t3: 33554945;id9_R_t3: 0
//output// id8_R_t3: 257;id9_R_t3: 0
//output// id8_R_t3: 33685761;id9_R_t3: 1
//output// id8_R_t3: 33685761;id9_R_t3: 0
//output// id8_R_t3: 33685761;id9_R_t3: 2
//output// id8_R_t3: 0;id9_R_t3: 2
//output// id8_R_t3: 131329;id9_R_t3: 513
//output// id8_R_t3: 131329;id9_R_t3: 512
//output// id8_R_t3: 33554433;id9_R_t3: 513
//output// id8_R_t3: 0;id9_R_t3: 1
//output// id8_R_t3: 131329;id9_R_t3: 514
//output// id8_R_t3: 33554432;id9_R_t3: 1
//output// id8_R_t3: 33554432;id9_R_t3: 0
//output// id8_R_t3: 33686016;id9_R_t3: 513
//output// id8_R_t3: 33554432;id9_R_t3: 2
//output// id8_R_t3: 33686016;id9_R_t3: 514
//output// id8_R_t3: 33554944;id9_R_t3: 514
//output// id8_R_t3: 33554944;id9_R_t3: 513
//output// id8_R_t3: 33554944;id9_R_t3: 512
//output// id8_R_t3: 33554688;id9_R_t3: 514
//output// id8_R_t3: 256;id9_R_t3: 514
//output// id8_R_t3: 33554432;id9_R_t3: 513
//output// id8_R_t3: 33554432;id9_R_t3: 512
//output// id8_R_t3: 33619969;id9_R_t3: 512
//output// id8_R_t3: 257;id9_R_t3: 512
//output// id8_R_t3: 33686017;id9_R_t3: 0
//output// id8_R_t3: 33686017;id9_R_t3: 1
//output// id8_R_t3: 33686017;id9_R_t3: 2
//output// id8_R_t3: 257;id9_R_t3: 514
//output// id8_R_t3: 65536;id9_R_t3: 512
//output// id8_R_t3: 65536;id9_R_t3: 513
//output// id8_R_t3: 65536;id9_R_t3: 514
//output// id8_R_t3: 33554432;id9_R_t3: 514
//output// id8_R_t3: 33554433;id9_R_t3: 514
//output// id8_R_t3: 33620224;id9_R_t3: 514
//output// id8_R_t3: 33620224;id9_R_t3: 512
//output// id8_R_t3: 33620224;id9_R_t3: 513
//output// id8_R_t3: 65792;id9_R_t3: 512
//output// id8_R_t3: 65792;id9_R_t3: 513
//output// id8_R_t3: 65792;id9_R_t3: 514
//output// id8_R_t3: 131585;id9_R_t3: 514
//output// id8_R_t3: 33554689;id9_R_t3: 514
//output// id8_R_t3: 33554689;id9_R_t3: 513
//output// id8_R_t3: 33554689;id9_R_t3: 512
//output// id8_R_t3: 513;id9_R_t3: 0
//output// id8_R_t3: 513;id9_R_t3: 1
//output// id8_R_t3: 513;id9_R_t3: 2
//output// id8_R_t3: 66048;id9_R_t3: 514
//output// id8_R_t3: 65536;id9_R_t3: 0
//output// id8_R_t3: 65536;id9_R_t3: 1
//output// id8_R_t3: 131584;id9_R_t3: 0
//output// id8_R_t3: 131584;id9_R_t3: 1
//output// id8_R_t3: 33686016;id9_R_t3: 1
//output// id8_R_t3: 33686016;id9_R_t3: 0
//output// id8_R_t3: 33686016;id9_R_t3: 2
//output// id8_R_t3: 33620224;id9_R_t3: 0
//output// id8_R_t3: 33620224;id9_R_t3: 1
//output// id8_R_t3: 33620224;id9_R_t3: 2
//output// id8_R_t3: 65792;id9_R_t3: 0
//output// id8_R_t3: 65792;id9_R_t3: 1
//output// id8_R_t3: 1;id9_R_t3: 0
//output// id8_R_t3: 1;id9_R_t3: 1
//output// id8_R_t3: 1;id9_R_t3: 2
//output// id8_R_t3: 33620480;id9_R_t3: 512
//output// id8_R_t3: 33620480;id9_R_t3: 513
//output// id8_R_t3: 33620480;id9_R_t3: 514
//output// id8_R_t3: 33619968;id9_R_t3: 2
//output// id8_R_t3: 131328;id9_R_t3: 2
//output// id8_R_t3: 33620225;id9_R_t3: 1
//output// id8_R_t3: 33619968;id9_R_t3: 1
//output// id8_R_t3: 33620225;id9_R_t3: 2
//output// id8_R_t3: 33619969;id9_R_t3: 513
//output// id8_R_t3: 33619968;id9_R_t3: 0
//output// id8_R_t3: 66049;id9_R_t3: 0
//output// id8_R_t3: 513;id9_R_t3: 514
//output// id8_R_t3: 66049;id9_R_t3: 1
//output// id8_R_t3: 513;id9_R_t3: 512
//output// id8_R_t3: 513;id9_R_t3: 513
//output// id8_R_t3: 66048;id9_R_t3: 2
//output// id8_R_t3: 66048;id9_R_t3: 1
//output// id8_R_t3: 66048;id9_R_t3: 0
//output// id8_R_t3: 131585;id9_R_t3: 513
//output// id8_R_t3: 131585;id9_R_t3: 512
//output// id8_R_t3: 131073;id9_R_t3: 513
//output// id8_R_t3: 131073;id9_R_t3: 512
//output// id8_R_t3: 131073;id9_R_t3: 514
//output// id8_R_t3: 33685761;id9_R_t3: 513
//output// id8_R_t3: 33685761;id9_R_t3: 512
//output// id8_R_t3: 33685761;id9_R_t3: 514
//output// id8_R_t3: 33686017;id9_R_t3: 514
//output// id8_R_t3: 33686017;id9_R_t3: 512
//output// id8_R_t3: 33686017;id9_R_t3: 513
//output// id8_R_t3: 257;id9_R_t3: 1
//output// id8_R_t3: 33554945;id9_R_t3: 1
//output// id8_R_t3: 257;id9_R_t3: 513
//output// id8_R_t3: 33685760;id9_R_t3: 514
//output// id8_R_t3: 65537;id9_R_t3: 1
//output// id8_R_t3: 65537;id9_R_t3: 0
//output// id8_R_t3: 33685760;id9_R_t3: 512
//output// id8_R_t3: 65537;id9_R_t3: 2
//output// id8_R_t3: 33554433;id9_R_t3: 0
//output// id8_R_t3: 33554433;id9_R_t3: 1
//output// id8_R_t3: 33554433;id9_R_t3: 2
//output// id8_R_t3: 33620481;id9_R_t3: 513
//output// id8_R_t3: 33620225;id9_R_t3: 0
//output// id8_R_t3: 66049;id9_R_t3: 512
//output// id8_R_t3: 131329;id9_R_t3: 2
//output// id8_R_t3: 131329;id9_R_t3: 1
//output// id8_R_t3: 131329;id9_R_t3: 0
//output// id8_R_t3: 131073;id9_R_t3: 1
//output// id8_R_t3: 131073;id9_R_t3: 0
//output// id8_R_t3: 66049;id9_R_t3: 514
//output// id8_R_t3: 131073;id9_R_t3: 2
//output// id8_R_t3: 0;id9_R_t3: 513
//output// id8_R_t3: 0;id9_R_t3: 512
//output// id8_R_t3: 131328;id9_R_t3: 514
//output// id8_R_t3: 1;id9_R_t3: 514
//output// id8_R_t3: 33619969;id9_R_t3: 2
//output// id8_R_t3: 131328;id9_R_t3: 513
//output// id8_R_t3: 33619969;id9_R_t3: 0
//output// id8_R_t3: 33619969;id9_R_t3: 1
//output// id8_R_t3: 33685505;id9_R_t3: 1
//output// id8_R_t3: 33685505;id9_R_t3: 0
//output// id8_R_t3: 33685505;id9_R_t3: 2
//output// id8_R_t3: 65793;id9_R_t3: 1
//output// id8_R_t3: 65793;id9_R_t3: 0
//output// id8_R_t3: 65793;id9_R_t3: 2
//output// id8_R_t3: 131584;id9_R_t3: 512
//output// id8_R_t3: 131584;id9_R_t3: 513
//output// id8_R_t3: 33620481;id9_R_t3: 512
//output// id8_R_t3: 33554944;id9_R_t3: 2
//output// id8_R_t3: 33554944;id9_R_t3: 1
//output// id8_R_t3: 33554944;id9_R_t3: 0
//output// id8_R_t3: 33685505;id9_R_t3: 514
//output// id8_R_t3: 512;id9_R_t3: 513
//output// id8_R_t3: 512;id9_R_t3: 512
//output// id8_R_t3: 131584;id9_R_t3: 514
//output// id8_R_t3: 512;id9_R_t3: 514
//output// id8_R_t3: 66049;id9_R_t3: 513
//output// id8_R_t3: 131072;id9_R_t3: 514
//output// id8_R_t3: 33620225;id9_R_t3: 513
//output// id8_R_t3: 33620225;id9_R_t3: 512
//output// id8_R_t3: 33620225;id9_R_t3: 514
//output// id8_R_t3: 131072;id9_R_t3: 512
//output// id8_R_t3: 131072;id9_R_t3: 513
//output// id8_R_t3: 65537;id9_R_t3: 514
//output// id8_R_t3: 65537;id9_R_t3: 513
//output// id8_R_t3: 65537;id9_R_t3: 512
//output// id8_R_t3: 66049;id9_R_t3: 2
//output// id8_R_t3: 131328;id9_R_t3: 0
//output// id8_R_t3: 131328;id9_R_t3: 1
//output// id8_R_t3: 256;id9_R_t3: 512
//output// id8_R_t3: 256;id9_R_t3: 513
//output// id8_R_t3: 66048;id9_R_t3: 513
//output// id8_R_t3: 65793;id9_R_t3: 514
//output// id8_R_t3: 65793;id9_R_t3: 513
//output// id8_R_t3: 65793;id9_R_t3: 512
