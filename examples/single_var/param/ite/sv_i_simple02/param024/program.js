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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      if(id6_R_t2 <= 0) {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id8_R_t2 = x[1]; report.push("id8_R_t2: "+id8_R_t2);
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
outputs[0] = "id6_R_t2: 1;id8_R_t2: 0";
outputs[1] = "id6_R_t2: 1;id8_R_t2: 1";
outputs[2] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 0;id7_R_t2: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmM9rgzAUx+/7K3JsoRBjEjM2emjZZIf9ALvSo4y5g7DWHexp7H+fGu1SeZm2OnTwbuGb74svL/nw
//JJQm+/Rjn1JK4sgLgzB1rwi7jqPLcuxQuk2it/fMcLckc/I5iSM33IQpm2URvBhNZ+RIFaAqDZWDXg56
//BajqXHNVZ6pVljm2L/Eu113DbercoguLLi26Z/lumc8XWTzekIcnrFn7mtV274Gq6eWgl4NeAXoF6JWg
//V9a9+oyDpV8c8lGFD5V08thJFZJPVRvPJli1hF9eE2ABOFbHrTZ5nB4XJX1NdtHcX9yvbqcXFNlGtpHt
///tkWXdkWf882Q7aRbWS7z759KObJXbuMRK6Ra+R6dD27DdcCuUauket/1a/l2f1aItfINXI90n4tz+7X
//Hbl2Mq7VyN/OhrqNP6VXljuqRsv1UDVzG+jzGumDOWt9FrUsFJiFArNQYBaqkWvjgawiW8GTVrYNFxz9
//G9/PwboN3gzxRrwR737xNv7VT4bbbW7diDaijWgPg7bogLZoifY3AnsvRA==
