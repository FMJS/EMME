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
      if(id4_R_t2 < id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 0";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 0";
outputs[5] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 0";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 2";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[8] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 2";
outputs[9] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 2";
outputs[10] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 2";
outputs[11] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 2";
outputs[12] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 1";
outputs[13] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 1";
outputs[14] = "id4_R_t2: 1;id5_R_t2: 0;id7_R_t2: 1";
outputs[15] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 1";
outputs[16] = "id4_R_t2: 2;id5_R_t2: 1;id7_R_t2: 1";
outputs[17] = "id4_R_t2: 1;id5_R_t2: 1;id7_R_t2: 1";
outputs[18] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[19] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 0";
outputs[20] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 0";
outputs[21] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
outputs[22] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 2";
outputs[23] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 2";
outputs[24] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 1";
outputs[25] = "id4_R_t2: 1;id5_R_t2: 2;id6_R_t2: 1";
outputs[26] = "id4_R_t2: 0;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt20tLw0AUBeC9vyJLBSGdnHYKigtFiwsfUJUuixgXBbUu6kr87zZ96FhnII+56VXOLkztTTPNx70e
//0jSdvs1e32Zpmkzy7ng4nmUHSedwkvec4/76OE2fp/nj0/yPz0+So+R9d5Jn49F4Zvbn78biaG8/2V1X
//KlaXdTZX+85qz7tq5tWe7ycvxXrmVHbXEVjvBur0Auur834kx1enyeX1/7uyxfr39XS9qz3vqlsB3grw
//VsBmheXuDk8Gi+39sWfrTzx/Z6d494+t87zY97+4OsNg9f1564dK+6suK96MiorL48X+Pkxf8qPB8cXN
//2d5O6gOUERABtQjoaxdE+Lh73AIeQzzE0yIeiOJBu3jczpMRD/Fsr/P8eilO33FXheAYwiGc7cGBDBzI
//wDGEQzg6xrXGcNAmnFDKlhEO4ahK2ZxeFS1jW9WMnbARD/FoStjK0KmWrzWEYwiHcP5AulYGDtqEE0rW
//CIdw9CRr9fuNP1eLiMYQDdGoTNXqo4EEGkM0RKM+Uas/oImgCaVphmiIRlWaBoE0DTJpGvEQj6Y0DdHT
//NMikaYRDOJrSNERP0yCTphEO4ehJ0xA5TYNMmkY0RKMnTUPkNA0yaRrREI2eNA2R0zTES9OKrmMjPdQp
//fbt8n9V6b10bqGEbo5G+sio3fJVbu+GObXwK6z2fbZam/WpDNtLvP93vyVZ7sPN2eFem4dAO7UjbQYV/
//bWyUB6Jl3HQ2BjW6oZut9RxI9RyI23F7TkY7tKNoXmvySwJ/1ynx2ECNWY1u6EbPrFb/URsJM6E5jWZo
//RtOc1qTXQNiN22sM3dCNohkN0Wc0iMxodEM3emY0RJ7RIDKj0QzNaJrREH1GK+vmE0iBdo4=
