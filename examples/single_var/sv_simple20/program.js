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
//eNrt3U2P3VgRgOE9vyJLIiHF9rGPr0EsQAixASRYsBwhDYuRGGAxrBD/nWQSMj1p57rt6/MRn2fX8u3O
//bXW637eqTtWpN2/++e/v/vXv7968efXN17ev/vTVd+Hnr7pffPP18v+P37z59p9f/+3vbz/hd79+9ctX
////npN18PX/3lq+/6n739ivD9R69/9upHT8cnT8Pq0+ndx8O7p/H7jz59Oj95Glefvv9e3z19/52+f9q/
///Yxv//rNP949H56839Pn4TPPx888n56869Pn8TPP5888v33m+/zw/f/31a/+8JtXv/+jn3G6n/EnP8On
//7/rD07j6dF59elv9d5++W1h9t7D6bmH13cLqu4XVdxtX321cfbdx9d3G1XcbV9/th9+l2+rTp58bVz83
//rn7uvPq586ef+/4v5k+//u33fzI/+n39///926/s3n31517s77043HsxfHhxufeVy/pXfvjGf/vhT331
//31//6vdf+ee/vPvK//7kzRq8e/AGb/AG7yvA+3E+//Dix1/3Lj26V971MNCHKUI6pEM6pF8+Ht+J9I+/
//1n1OpIcTkD5DOqRDOqRfAemPBuKlgf70T+xMzMdpCmJ3oAd6oG+8lv7cAh9/fYecqB9PgbroHdRBHdSv
//X2PfFb2XQfp69H4G6OdlAHqgB3qgv3z0/oLiemnQh4SgD0AP9EAP9FcA/WMl9zrj+VTwn3oxPvRDP/Tr
//rvnkxY8/1KyHsU//K48iXTQP6ZAO6bprKgD6ejz/OOZj7MYb0AM90AN9g/X5Z9WZ0qAfE4J+AXqgB3qg
//b64+Xx3mt/ttzoR/H/puVqJHf/RHf030n7z48ceX9YQ2nkN1VXpUR3VU10VfAdPXo/pTSB8GZXqkR3qk
//10ZfAelDStKr0yM90iO9PvpKI/qE9J9uI/qjP/qjf4Nx/rPD2NL8n1b/IE8i/YT0SI/0SN9cnF8d57f7
//68+kfwjTNI5BRw7+4z/+WxH1yYsff1AhpwPms7iuJwfXcR3XW9wedSfoL0P19cj+JNbHm64crMd6rG/x
//4ps7p7VlWB/Ssl5fDtZjPdZf9EacY305NUX16fgf+2WJYn38x3/8b7Fef+cGhTIGGNOyXqyP9ViP9Ret
//4R+7K6emWD8h/4duGHTh4z/+4/9FY/09C0vqrOon5r/efPzHf/z/cvl/0rqqXPQ/urHq9HPeZRT7Yz/2
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
