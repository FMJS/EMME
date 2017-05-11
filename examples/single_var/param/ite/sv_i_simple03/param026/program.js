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
      var x = new Int8Array(data.x_sab); x[0] = 1;
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
      if(id4_R_t2 == id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
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
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 0";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 0";
outputs[6] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[8] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[9] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 2";
outputs[10] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 2";
outputs[11] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 2";
outputs[12] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 1";
outputs[13] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[14] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 1";
outputs[15] = "id4_R_t2: 1;id5_R_t2: 2;id7_R_t2: 1";
outputs[16] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[17] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 1";
outputs[18] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[19] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 0";
outputs[20] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 2";
outputs[22] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 2";
outputs[23] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 2";
outputs[24] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[25] = "id4_R_t2: 2;id5_R_t2: 2;id6_R_t2: 1";
outputs[26] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt201Lw0AQBuC7vyJHBSHNTrMFxYOixYMfUJUeixgPBbUe6kn87zZtqtsyC/mYqYO8t7Btp2bNw4wv
//a5rOPubvH/M0TaZFfzKazN1R4o6nRV5d9xbXg/V1mr7OiueXxZsvz5KT5HN/WrjJeDLPDhefpuXVwWGy
//v65Urq7qbK8OgtWcXc0W1V4fp2/lugsqh+sUWe9H6uSR9ep7v5LTm/Pk+vb/3dly/fd++uxqzq6GFYit
//QGwF2q6w2t3R2XC5vRt79rMLvfKzGxu3vpngxQH/YlV/WP32mOqxwnzNVb27cVlvdb3c26fZW3EyPL26
//uzjYSzk8GfAAzw7xkCoe2i2eXoDHAQ/wKONhhOTxttQUzyaTnO1ISp0HeIDnDztPZzp831GCE3adDHAA
//5y+7Dml1HdLB44AHeGyEBZ3p8FHBDuCEQYEDHMAxlLIFnxPK2Kp3SydsgAM4lhK2OnBol3Bi6RrgAI6l
//dK0OnGbZmmDHARzAsZmste83KmhiqRrQAI2lVK1LtyENOA5wAMd8otY+FlBHE4YCGdAAjaE0jcTTNNJJ
//0wAHcCylaSSeppFOmgY4gGMpTSPxNI100jTAARw7aRoJp2mkk6YBDdBYStNIPE0jnTQNcADHTppGwmma
//YLcpr73QoU7tx+X3Wz376PpIDd8ZjfadNXngmzzaHXds66fw7Pf5bt2GedELnYneXPfNDnfejx7qNB0H
//P/Cj7Mc1+BPHixyKDlfl3GRbwxrcwI2mG2owrHmRf2EjFTexec3BDdyYmte6nLaJTWs1jg60mNVgB3bs
//zGrtj9vwk1o3M7E5DWZgxs6c1v5ANCmYic1oGczAjKkZjRRmNFKZ0WAHduzMaCQ8o5HKjAYzMGNnRiPh
//Ga2umW+YEnaO
