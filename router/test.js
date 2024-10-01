// - 副程式: 檢查24小時的資料是否存在並取得，如果該小時不存在會進行補值再回傳
async function check24HourExists(specifiedTime) {
    try {
      console.log("########################################################################");
      console.log("------ 執行檢查全日24小時的執行率是否存在 ------");
      const targetDay = formatDate(specifiedTime);
      console.log("targetDay: ", targetDay);
  
      // 設定查詢條件，查詢指定日期的 24 小時資料
      const filter = {
        selector: {
          Date: targetDay,
          time: {
            $gte: 0,
            $lte: 23,
          },
        },
        limit: 24,
      };
  
      // 查詢數據庫以獲取現有資料
      let result = await report_hourDb.find(filter);
      const existingTimeIndexes = new Set(result.docs.map((doc) => doc.time));
      const missingTimeIndexes = [];
  
      // 檢查每個小時是否存在，如果不存在則加入缺失時段的索引
      for (let i = 0; i < 24; i++) {
        if (!existingTimeIndexes.has(i)) {
          missingTimeIndexes.push(i);
        }
      }
      console.log("缺少的時段 missingTimeIndexes:", missingTimeIndexes);
  
      // 如果沒有缺少時段，資料完整
      if (missingTimeIndexes.length === 0) {
        console.log("資料完整，存在 24 筆資料。");
        return { complete: true, missingTimeIndexes: [], result };
      } else {
        console.log(
          `資料不完整，缺少的時間段: ${missingTimeIndexes.join(", ")}。`
        );
  
        // 逐一補值，每次只補一個小時，補完再補下一個小時
        for (const Hour of missingTimeIndexes) {
          let targetHourTime;
          targetHourTime = moment.utc(specifiedTime).set({
            hour: Hour + 1,
            minute: 15,
            second: 5,
            millisecond: 0,
          });
  
          // 呼叫 `getSnigleHourValue` 補齊缺失小時的資料
          console.log(
            `正在補值的小時: ${Hour}, 時間: ${targetHourTime.format()}`
          );
          try {
            // 一次只補一個小時，等待補值完成再進行下一個小時的補值
            await getSnigleHourValue(targetHourTime);
          } catch (error) {
            console.error(`補值失敗: 小時 ${Hour}，錯誤: `, error);
          }
        }
  
        console.log("所有缺失的小時補值已完成。");
  
        // 再次查詢完整資料
        result = await report_hourDb.find(filter);
        return { complete: true, missingTimeIndexes, result };
      }
    } catch (error) {
      console.error("check24HourExists 出錯: ", error);
      return { complete: false, error };
    }
  }
  