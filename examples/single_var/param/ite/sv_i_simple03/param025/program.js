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
//eNrt2stqwkAUBuB9nyJLBSGOx4zQ4kJppYteQFtchtJ0EajaRVyVvntzrYnOQC4zmk7+3XBiTsyYj6M/
//2vZuH3ztA9u2fG/sLt1gdG0Nb3zPSdcsXE+yum1vdt7HZ/ji+7k1tb57vjdy127ABuHZFK/6A6uXdYqq
//SZ/j6iRXdYRVFnbbvPnbqD7Kdc7XSVIfS/o4knp63R9r9nRrPT6bd2dx/XA/Y2HVEVbzHUjYgYQd6LhD
//srvL+SLe3sKeZe84PHMYnV3Yur8tyg5NxOel/RfppyfsLm4s7pn0W62jfsk63tv33dabLmYPq7v+lQ08
//wNNqPKQLD50XDwMe4GnR5MkdUjR30irgAI7JU6cJHAIcwOnqxCHlE4cAB3DMnzikfOIohBOtuaKAQPcj
//c7gqFz6+XNKDN4aj+86qPPRVHu+GO3b0LrjwerwZHMFBrigiKNZ5tZDgZfkq88PgB37O6OfkS5lSPfnP
//A3Zgxyw7pNUOXcwOgx3YudzcOTmkZurkq3ADN8bNnMZuCG7gpnvzhvTMG4IbuDF53pCeeaPHjSyXZnAD
//N63KpZv8iUCWDpT4G0GNXA12YKdNmXQZOdUSabiBG/Pz6DJu6EJuGNzATSuz6PrTRpyowQzMmJ5D1580
//MAMz3cyg688ZghmY6WT+XH/O6DCD7Blm/kf2TBqyZ0KGBjvGZ8+kPHuGG7gxP3sm5dkz4fcN3BiePZPi
//7BlmYMb07JkUZ88wAzOmZ8+kOHuGGZgxPXsmxdlzWTO/TkZz6w==
