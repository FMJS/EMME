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
      var x = new Int8Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); id3_R_t1 = x[0]; report.push("id3_R_t1: "+id3_R_t1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[0] = 2;
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
outputs[0] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 0";
outputs[5] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 0";
outputs[6] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 0";
outputs[7] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 0";
outputs[8] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 0";
outputs[9] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 0";
outputs[10] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 0";
outputs[11] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 0";
outputs[12] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 0";
outputs[13] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 0";
outputs[14] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 0";
outputs[15] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 0";
outputs[16] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 0";
outputs[17] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 0";
outputs[18] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 0";
outputs[19] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 0";
outputs[20] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 0";
outputs[21] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 0";
outputs[22] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 0";
outputs[23] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 0";
outputs[24] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 0";
outputs[25] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 0";
outputs[26] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 0";
outputs[27] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 1";
outputs[28] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 1";
outputs[29] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 1";
outputs[30] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 1";
outputs[31] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 1";
outputs[32] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 1";
outputs[33] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 1";
outputs[34] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 1";
outputs[35] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 1";
outputs[36] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 1";
outputs[37] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 1";
outputs[38] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 1";
outputs[39] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 1";
outputs[40] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 1";
outputs[41] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 1";
outputs[42] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 1";
outputs[43] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 1";
outputs[44] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 1";
outputs[45] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 1";
outputs[46] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 1";
outputs[47] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 1";
outputs[48] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 1";
outputs[49] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 1";
outputs[50] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 1";
outputs[51] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 1";
outputs[52] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 1";
outputs[53] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 1";
outputs[54] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 2";
outputs[55] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 2";
outputs[56] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 0;id5_R_t2: 2";
outputs[57] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 2";
outputs[58] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 2";
outputs[59] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 0;id5_R_t2: 2";
outputs[60] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 2";
outputs[61] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 2";
outputs[62] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 0;id5_R_t2: 2";
outputs[63] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 2";
outputs[64] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 2";
outputs[65] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 1;id5_R_t2: 2";
outputs[66] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 2";
outputs[67] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 2";
outputs[68] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 1;id5_R_t2: 2";
outputs[69] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 2";
outputs[70] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 2";
outputs[71] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 1;id5_R_t2: 2";
outputs[72] = "id2_R_t1: 0;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 2";
outputs[73] = "id2_R_t1: 1;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 2";
outputs[74] = "id2_R_t1: 2;id3_R_t1: 0;id4_R_t2: 2;id5_R_t2: 2";
outputs[75] = "id2_R_t1: 0;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 2";
outputs[76] = "id2_R_t1: 1;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 2";
outputs[77] = "id2_R_t1: 2;id3_R_t1: 1;id4_R_t2: 2;id5_R_t2: 2";
outputs[78] = "id2_R_t1: 0;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 2";
outputs[79] = "id2_R_t1: 1;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 2";
outputs[80] = "id2_R_t1: 2;id3_R_t1: 2;id4_R_t2: 2;id5_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3UFrE1EYheG9vyLLCoWYickBxYVFxI0KunBZhLooWOuiXUn/u03T2NHeSe/NfN8J2HcXppkkM/rA
//gRxyptPzy4uflxfT6eT0pDv+dHwxezF59vL0ZN57/Hz1uFs/XmweT6dn5yffvl+f+O5o8mry62Bz/uFk
//c/bTw8nB5uzV0fW566PL4y/HF/PVUd08Wh+dXT8++3r64/DPp7l/fD5w/Hnv1fvHFwPHlwPve/t5riav
//P7yZvP/4P17bzfG7K+q/+t3RRfHosvgK/dedF193XnzdefF158XXvbvXy+LR/nMXxecu/n3u+t/409Hb
//m3/kv65oc9euz3y2Ovuvj1X4493nKPxxUf7j7du/vfdfrPesofcdesvyu63f6fOX1TtdPZmW0M9AD/pH
//jv7PeX7y5VuRCb4DPOAfOXjtD7zs4PuxfgZ4wBPrD8of1hrqy5cdHekBD3givZF7+UbkYe/ADnbi/H6w
//y4y9H+U7sIOdKH9Q/ljWKC9LlAc84InyRu4tNyI6yoMd7ER5I3aZsQ+VbWZgBztR/oEv4u5lguyqTfkS
//I4o2gAc8UT6Ze1vNZjz2DuxgJ8rvB7vM2IcKNmAHO1F++5dwaUF++eCtiC3XgB3sxPhU6i3VmtgID3Sg
//E+Ft0GWFPlSqATrQie/bv3hLi+8yxHewg534bqO+622ILdMAHejE91ToskIfKtJ0QAc68f2BL9vkLtIo
//rUgDeMAT4ZO5txVplFakATvYifHJ2GXGPlSkATvYifLbv3STt0ijtCIN2MFOjE+l3lKkUVqRBuhAJ8Kn
//QpcV+lCRBuhAJ75v/9JN3iKN0oo0YAc78T2VesttUFqRBuhAJ76nQpcVes380wzoQKdI0/oTVL2gkD7+
//tOxf5OjpJ8ADniJNAveY4ad67B3YwU6M3w92mbHXTD6BHewUaYxBvm0WYrcYD3awE+Nt1CPGnnaL8EAH
//OhHeBl1W6DUzT0AHOkUaY3yXIb6DHezEdxv1iIGn3eI70IFOfLdBlxV6zbQT0IFOkabx56cyajTLbZcd
//NOsEdrBTogmnHjHqNL5AA3SgE99TocsKvWbOCehApzxjC+8t0w/jizNABzrRPZH5+CGn8aUZkIOc2J6I
//XEbkNRNOIAc5hRlbZFd6ZAc60InsJubjx5vGF2VADnIieyJyGZHXzDaBHOSUZBp/WiqjJKOkkgzYwU5s
//T6UeMdg0viQDdKAT3VOhywq9ZqoJ6ECnJGML7ztcctBME9CBTknGEtxzkHcgBzmx3Y9cRuQ180wgBzkl
//GVtkV3pkBzrQiewm5uOHmcaXZEAOciJ7InIZkddMMnUgBzklmdafjZJxkkmhk0yABzxFmQTuMZNMCp1k
//AjvYKcskYJcZe80kE9jBTmHGGOTbBhwUOskEdrBTmjGF+CzoHdCBToTfB3RZoddMMgEd6JRnjPFdhvgO
//drAT323UIyaZFDrJBHSgU6IxxXcZ4vvQeAPQgU6RpvFnpWSbZFLoJBPYwU6JJpx6xCSTQieZgA50CjTh
//0GWFXjPJBHSgU56xhfeWIQeFTjIBHegUZyzBPQd5B3KQE9v9yGVEXjPJBHKQU5ixRXalR3agA53IbmI+
//fpJJoZNMIAc5RRlLZFd6ZB8abwA5yCnJNP6slGyTTAqdZAI72CnJhFOPmGRS6CQT0IFOSSYcuqzQayaZ
//gA50SjK28N5yyQqdZAI60CnJWIJ7DvIO5CAntvuRy4i8ZpIJ5CCnJGOL7EqP7EAHOpHdxHz8JJNCJ5lA
//DnJKMpbIPhb5bwNC0BU=
