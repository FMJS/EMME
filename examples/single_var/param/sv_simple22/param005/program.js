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
      var x = new Int16Array(data.x_sab); id2_R_t1 = Atomics.load(x, 0); report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = Atomics.load(x, 0); report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 0, 1);
      var x = new Int8Array(data.x_sab); Atomics.store(x, 1, 1);
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 1;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 256;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 257;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 1";
outputs[5] = "id2_R_t1: 1;id5_R_t2: 1";
outputs[6] = "id2_R_t1: 256;id5_R_t2: 1";
outputs[7] = "id2_R_t1: 257;id5_R_t2: 1";
outputs[8] = "id2_R_t1: 0;id5_R_t2: 256";
outputs[9] = "id2_R_t1: 1;id5_R_t2: 256";
outputs[10] = "id2_R_t1: 256;id5_R_t2: 256";
outputs[11] = "id2_R_t1: 257;id5_R_t2: 256";
outputs[12] = "id2_R_t1: 0;id5_R_t2: 257";
outputs[13] = "id2_R_t1: 1;id5_R_t2: 257";
outputs[14] = "id2_R_t1: 256;id5_R_t2: 257";
outputs[15] = "id2_R_t1: 257;id5_R_t2: 257";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2kFrgzAYBuD7fkWOGxRibGpgY4eVUXbZBt2hRxm4g7CuO7Sn0f++OK2mms6o+fTy3uQz+YxRHuRF
//zneH/fdhzzlLkzBex3txy4K7NFlkx6E+5ny7Sz4+9YCnJbtnP9encTM9Yx5v9NHNjJ1VpVHNR9Srefes
//GmXVsF5VRjUfUa8Kfbx9T79m5bqbdXN1Zl1eqOfXb9ajC9ct1nNkDy+P7PkVu2Pbndrdm12qamQda3ao
//dsrsUFUj61izg7R2kNYOst4hf8br5ervIZ+t8nTPemaQzb50UhQnq+domWk9KU6XXzVeMWOUfXY+821T
//zHR5MYrtOV5xGw4COAAH4NAdB9HAoWwa0NNg385uYPwPQ7iIQANoAA0+vhvKBYgxaVBkNCjQABpAgyMN
//jQ+DsWBo3zSfLJg5gwAKQAEoUOcMzZPl4wkGpAy1etGzPXtwyBgAA2AADMQZgw8WnBOGdiycEgbAABgA
//A3HC4BcGRQaDAgyAATCMlS/0Y6FXutAbBTNd0F8OQAEoAIXx/2MoH4Pwly9Ij/kCaAANoGGCvxi6w9A3
//YZA9EwbQABpAwwR/MQyhQZHRoEADaAANU/7F4AKDj5RB9kwZFFAACkCBJGUwEkafGcPc+ir5TRjAAlgA
//CxQJg1cU2vIFZyoc0wWwABbAAkW6QMSCImJBgQWwABaIk4WBKHTJFdxJ+AU//jOw
