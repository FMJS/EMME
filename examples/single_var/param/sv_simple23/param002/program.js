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
      var x = new Float64Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 1.0000;
      var x = new Float32Array(data.x_sab); x[1] = 1.0000;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Float64Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2.toFixed(4));
      var x = new Float32Array(data.x_sab); x[0] = 0.0000;
      var x = new Float32Array(data.x_sab); x[1] = 0.0000;
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
outputs[0] = "id2_R_t1: 0.0000;id5_R_t2: 0.0000";
outputs[1] = "id2_R_t1: 0.0000;id5_R_t2: 0.0078";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3E9vmzAYx/H7XgXHVYrGP2NPq3pYNVW7bJO6Q49RpewQaW13SE9T3/vIIMEB26GtoYZ8e6qeB0gg
//5CPLP5w4fnjc/HncxHG0XmXL6+Um/RQlH5Ly73y9KraFbFeI47uH1a/f5aZfL6OL6O/73R6Lct98eVP+
//d7aIDqpCq1ZbtKvVS2yrclvN2lWlVast2tW0/P/udn2/2J9Bt66/O70uLPXq9bt1aXnd+v08RZ+/f4m+
///eDqmK5O6+z1ozRVadxWP0JzpfQjNFVp3FY/gjAeQRiPINpHqD7j68ur/x/ywbvcnXO5Z7Ld29ZMXc3M
//1cxdTeFqFq6mdDVV3WzuOsN5Gpupq5m5mrmrKVzNwtWUrqbafbRXna+vtpV572rPnzf1nn2+dPWt9/Qu
//hmAIhmDvBA/MoeF6JfZWam9l9lYOvYf0mm/S54EMvMALvDMb+3bJ3p+0sLcKe4tRr5VeBb3QC73B0Dv8
//+NObqhJwHeAevwnhFm7hNpiRrnyDuQBGuONOLgAxEAMxUw5zjtsGk7fd3N/6+SvCtla9PubxCA5+4Rd+
//idqCidoCZrd30HYcY9iFXdglaAtoGmIS8CrgBV7gJWabfMwWFLcvmtsFW7AFW0I2RrdDTCvAMAzDMJMN
//J7uirevu/kYV9lZhbyl/8ZogXoNe6CVem9dKtrcj96XRmmC0C7mQS7Q23Sd8Q0BXgS7ogi6x2rxXr41J
//rY+5XKAFWqAlUmNUO96KNb8Eq48QDMEQTJzW3C+JvZXaW5nrSQPP1kqvIVpu/GoOEqHBLdzC7UlHaCfG
//7LHgrDe+MAuzMEts1nuC4WShVUALtEBLVDZoVDZ7Xp8zOwuu4AquxGOMXkcNxQZhl6cSYBd2icRGeUZB
//jui08v7zjaw6g2M4JjKb/KqzIBl+5c85MiqGYRgmUpvUM7uBQ6yAGIiBmMhtpqvTAuHX4++MgS/4gi+R
//HKPfMNar9Wf5H/rTa7A=
