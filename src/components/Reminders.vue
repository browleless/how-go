<template>
    <div>
        <p>The Reminders Page</p>
                <div>Your Upcoming Events!</div>
        <div>{{ this.$store.state.todayEvents }}</div>
        <div>{{ this.$store.state.tmrwEvents }}</div>


    </div>
</template>