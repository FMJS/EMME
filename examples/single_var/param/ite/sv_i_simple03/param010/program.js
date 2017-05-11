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
      var x = new Int8Array(data.x_sab); x[0] = 0;
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
      if(id4_R_t2 >= id5_R_t2) {
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
outputs[0] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 1;id7_R_t2: 1";
outputs[2] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 0";
outputs[3] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 0";
outputs[4] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 0";
outputs[5] = "id4_R_t2: 0;id5_R_t2: 0;id6_R_t2: 1";
outputs[6] = "id4_R_t2: 1;id5_R_t2: 0;id6_R_t2: 1";
outputs[7] = "id4_R_t2: 1;id5_R_t2: 1;id6_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmjtvwjAUhff+iowgIQXnkiC1YgC1qEMfErRijKqmQ6QCHcJU9b83zxJSW8rDDq57NusanxDjTyf3
//ENveH6KPQ2TbVhhM/JUfOZfW+CoM3HzM4vG0qNv2dh+8vccfvl1YM+tzEAaOv/EjNopXUzoajqxBoZRU
//M51qdVqqutwqi9W2L+EuqTsl5XKdBPWJQMcV1PPrflnzh2vr/tG8O0vrx/uZcKsut1pWIK4CcRWoqpDt
//7mqxTLf3ZM+KbxyvHCerT7buZ4uKqSl/Xa6/zH89rjpfmK+Z6a03iV42Tvf2db8LZsv53fpmeGEDHsBz
//bnioyodEdMo7eTZwGMABOBq5TmlKkufkVYADcMx1nDrYNPEbRdDgMQ3Q6OQ2JN1tCOAAHNPdhiS7jURo
//krEnCRrVx+V4VY97dD2BhtcZGtV31uTANznaHXes8i087vW8bm7DmfQkZWqnda9ZOPC0ehbxw8AP+OmR
//H0dsOhLocbjGo4odeA/Y6ZMdUsoO9coOqzQ7YAfsnMl3fk3JcZ1yFZ4Dbgzsd6grOaJuh5Swg14H7Gji
//OaTGcwieA25M7nM6c0MacMPADbjRKpvu8uaNKCGo8RpBi2c1sAN2dMql65DTLJXuxg08B9z8hUy6/Utr
//6v2GgRtwo2Ue3d5t+Gk0vAbMmJ9Fd+luSAE36G3Ajf45dHuvIXgNmPmXGXT7rqZPZvC/DZjRK38mBfkz
//KXlGAztgR6f8maTnzwTPATfG588kPX8mJfkzuAE3+uTPJDl/hteAGfPzZ5KeP6O3ATem588kOX+G14AZ
//0/Nnkpw/12XmGyzPc9A=
