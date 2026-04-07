/*
  useRealtime.js
  --------------
  Subscribes to a Supabase Realtime channel for INSERT events
  on a given table. Returns new rows as they arrive so the
  feed / notifications page can prepend them instantly.

  Example:
    const newPosts = useRealtime("feed_posts");
    // newPosts is an array that grows as inserts happen
*/

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export function useRealtime(table, filter) {
  const [incoming, setIncoming] = useState([]);
  const filterColumn = filter?.column;
  const filterValue = filter?.value;

  useEffect(() => {
    // build the channel — Supabase wants a unique name per subscription
    const channelName = `realtime-${table}-${Date.now()}`;

    let config = {
      event: "INSERT",
      schema: "public",
      table,
    };

    // optional column filter, e.g. { column: "user_id", value: "abc-123" }
    if (filterColumn && filterValue) {
      config.filter = `${filterColumn}=eq.${filterValue}`;
    }

    const channel = supabase
      .channel(channelName)
      .on("postgres_changes", config, (payload) => {
        setIncoming((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    // cleanup when unmounting or deps change
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filterColumn, filterValue]);

  // lets the parent clear old entries after processing
  function clearIncoming() {
    setIncoming([]);
  }

  return { incoming, clearIncoming };
}
